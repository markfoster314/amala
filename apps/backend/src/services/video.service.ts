import { docClient, TABLE_NAME } from './dynamodb.service';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { Video, VideoInput, VideoResponse } from '../types/video.types';
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from '../utils/errors';
import { randomUUID } from 'crypto';

function createPublicPK(videoId: string): string {
  return `PUBLICVIDEO#${videoId}`;
}

function createPrivatePK(videoId: string): string {
  return `PRIVATEVIDEO#${videoId}`;
}

function parseVideoId(pk: string): string {
  if (pk.startsWith('PUBLICVIDEO#')) {
    return pk.replace('PUBLICVIDEO#', '');
  }
  if (pk.startsWith('PRIVATEVIDEO#')) {
    return pk.replace('PRIVATEVIDEO#', '');
  }
  throw new ValidationError('Invalid video ID format');
}

function validateVideoInput(input: VideoInput): void {
  if (
    !input.title ||
    typeof input.title !== 'string' ||
    input.title.trim().length === 0
  ) {
    throw new ValidationError('Title is required');
  }
  if (
    !input.videoUrl ||
    typeof input.videoUrl !== 'string' ||
    input.videoUrl.trim().length === 0
  ) {
    throw new ValidationError('Video URL is required');
  }
  if (
    !input.thumbnailUrl ||
    typeof input.thumbnailUrl !== 'string' ||
    input.thumbnailUrl.trim().length === 0
  ) {
    throw new ValidationError('Thumbnail URL is required');
  }
}

export async function createVideo(
  userId: string,
  videoData: VideoInput
): Promise<VideoResponse> {
  validateVideoInput(videoData);

  const videoId = randomUUID();
  const pk = videoData.isPublic
    ? createPublicPK(videoId)
    : createPrivatePK(videoId);
  const now = new Date().toISOString();

  const video: Video = {
    PK: pk,
    SK: 'METADATA',
    title: videoData.title.trim(),
    videoUrl: videoData.videoUrl.trim(),
    thumbnailUrl: videoData.thumbnailUrl.trim(),
    userId,
    createdAt: now,
    updatedAt: now,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: video,
  });

  await docClient.send(command);

  return {
    videoId,
    title: video.title,
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
    userId,
    isPublic: videoData.isPublic,
    createdAt: video.createdAt,
    updatedAt: video.updatedAt,
  };
}

export async function getVideo(
  videoId: string,
  userId?: string
): Promise<VideoResponse> {
  // Try public first
  let pk = createPublicPK(videoId);
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
    pk = createPrivatePK(videoId);
    command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: pk,
        SK: 'METADATA',
      },
    });

    response = await docClient.send(command);

    if (!response.Item) {
      throw new NotFoundError('Video not found');
    }

    const video = response.Item as Video;

    // Check if user has access (must be the creator)
    if (!userId || video.userId !== userId) {
      throw new ForbiddenError('You do not have access to this private video');
    }

    return {
      videoId,
      title: video.title,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      userId: video.userId,
      isPublic: false,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
  }

  const video = response.Item as Video;

  return {
    videoId,
    title: video.title,
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
    userId: video.userId,
    isPublic: true,
    createdAt: video.createdAt,
    updatedAt: video.updatedAt,
  };
}

export async function getPublicVideos(): Promise<VideoResponse[]> {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: 'begins_with(PK, :prefix)',
    ExpressionAttributeValues: {
      ':prefix': 'PUBLICVIDEO#',
    },
  });

  const response = await docClient.send(command);

  if (!response.Items || response.Items.length === 0) {
    return [];
  }

  return response.Items.map((item) => {
    const video = item as Video;
    const videoId = parseVideoId(video.PK);

    return {
      videoId,
      title: video.title,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      userId: video.userId,
      isPublic: true,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
  });
}
