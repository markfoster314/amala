import type { Response, NextFunction, RequestHandler } from 'express';
import multer from 'multer';
import * as playlistService from '../services/playlist.service';
import { uploadThumbnail } from '../services/s3.service';
import { ValidationError, ForbiddenError } from '../utils/errors';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

interface PlaylistRequest extends AuthenticatedRequest {
  body: {
    title?: string;
    description?: string;
    isPublic?: string; // Will be 'true' or 'false' from form
  };
}

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ValidationError('Only image files are allowed for thumbnails'));
    }
  },
});

export const uploadThumbnailMiddleware: RequestHandler = upload.single(
  'thumbnail'
) as unknown as RequestHandler;

export async function createPlaylist(
  req: PlaylistRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new ForbiddenError('User ID not found in token');
    }

    const { title, description, isPublic } = req.body;
    const file = req.file;

    if (!title) {
      throw new ValidationError('Title is required');
    }

    if (!file) {
      throw new ValidationError('Thumbnail file is required');
    }

    // Upload thumbnail to S3
    const thumbnailUrl = await uploadThumbnail(file.buffer, file.mimetype);

    const playlist = await playlistService.createPlaylist(userId, {
      title,
      description,
      thumbnailUrl,
      isPublic: isPublic === 'true',
    });

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
}

interface GetPlaylistRequest extends AuthenticatedRequest {
  params: {
    playlistId: string;
  };
}

export async function getPlaylist(
  req: GetPlaylistRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { playlistId } = req.params;
    const userId = req.userId;

    if (!playlistId) {
      throw new ValidationError('Playlist ID is required');
    }

    const playlist = await playlistService.getPlaylist(playlistId, userId);

    res.json(playlist);
  } catch (error) {
    next(error);
  }
}

export async function getPublicPlaylists(
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const playlists = await playlistService.getPublicPlaylists();
    res.json(playlists);
  } catch (error) {
    next(error);
  }
}
