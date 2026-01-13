import { docClient, TABLE_NAME } from './dynamodb.service';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type {
  Playlist,
  PlaylistInput,
  PlaylistResponse,
} from '../types/playlist.types';
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from '../utils/errors';
import { randomUUID } from 'crypto';

function createPublicPK(playlistId: string): string {
  return `PUBLICPLAYLIST#${playlistId}`;
}

function createPrivatePK(playlistId: string): string {
  return `PRIVATEPLAYLIST#${playlistId}`;
}

function parsePlaylistId(pk: string): string {
  if (pk.startsWith('PUBLICPLAYLIST#')) {
    return pk.replace('PUBLICPLAYLIST#', '');
  }
  if (pk.startsWith('PRIVATEPLAYLIST#')) {
    return pk.replace('PRIVATEPLAYLIST#', '');
  }
  throw new ValidationError('Invalid playlist ID format');
}

function validatePlaylistInput(input: PlaylistInput): void {
  if (
    !input.title ||
    typeof input.title !== 'string' ||
    input.title.trim().length === 0
  ) {
    throw new ValidationError('Title is required');
  }
  if (
    !input.thumbnailUrl ||
    typeof input.thumbnailUrl !== 'string' ||
    input.thumbnailUrl.trim().length === 0
  ) {
    throw new ValidationError('Thumbnail URL is required');
  }
  if (
    input.description !== undefined &&
    typeof input.description !== 'string'
  ) {
    throw new ValidationError('Description must be a string');
  }
}

export async function createPlaylist(
  userId: string,
  playlistData: PlaylistInput
): Promise<PlaylistResponse> {
  validatePlaylistInput(playlistData);

  const playlistId = randomUUID();
  const pk = playlistData.isPublic
    ? createPublicPK(playlistId)
    : createPrivatePK(playlistId);
  const now = new Date().toISOString();

  const playlist: Playlist = {
    PK: pk,
    SK: 'METADATA',
    title: playlistData.title.trim(),
    description: playlistData.description?.trim(),
    thumbnailUrl: playlistData.thumbnailUrl.trim(),
    userId,
    createdAt: now,
    updatedAt: now,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: playlist,
  });

  await docClient.send(command);

  return {
    playlistId,
    title: playlist.title,
    description: playlist.description,
    thumbnailUrl: playlist.thumbnailUrl,
    userId,
    isPublic: playlistData.isPublic,
    createdAt: playlist.createdAt,
    updatedAt: playlist.updatedAt,
  };
}

export async function getPlaylist(
  playlistId: string,
  userId?: string
): Promise<PlaylistResponse> {
  // Try public first
  let pk = createPublicPK(playlistId);
  let command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: pk,
      SK: 'METADATA',
    },
  });

  let response = await docClient.send(command);

  // If not found, try private
  if (!response.Item) {
    pk = createPrivatePK(playlistId);
    command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: pk,
        SK: 'METADATA',
      },
    });

    response = await docClient.send(command);

    if (!response.Item) {
      throw new NotFoundError('Playlist not found');
    }

    const playlist = response.Item as Playlist;

    // Check if user has access (must be the creator)
    if (!userId || playlist.userId !== userId) {
      throw new ForbiddenError(
        'You do not have access to this private playlist'
      );
    }

    return {
      playlistId,
      title: playlist.title,
      description: playlist.description,
      thumbnailUrl: playlist.thumbnailUrl,
      userId: playlist.userId,
      isPublic: false,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
    };
  }

  const playlist = response.Item as Playlist;

  return {
    playlistId,
    title: playlist.title,
    description: playlist.description,
    thumbnailUrl: playlist.thumbnailUrl,
    userId: playlist.userId,
    isPublic: true,
    createdAt: playlist.createdAt,
    updatedAt: playlist.updatedAt,
  };
}

export async function getPublicPlaylists(): Promise<PlaylistResponse[]> {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(PK, :prefix)',
    ExpressionAttributeValues: {
      ':prefix': 'PUBLICPLAYLIST#',
    },
  });

  const response = await docClient.send(command);

  if (!response.Items || response.Items.length === 0) {
    return [];
  }

  return response.Items.map((item) => {
    const playlist = item as Playlist;
    const playlistId = parsePlaylistId(playlist.PK);

    return {
      playlistId,
      title: playlist.title,
      description: playlist.description,
      thumbnailUrl: playlist.thumbnailUrl,
      userId: playlist.userId,
      isPublic: true,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
    };
  });
}
