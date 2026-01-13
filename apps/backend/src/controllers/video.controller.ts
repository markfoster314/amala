import type { Response, NextFunction, RequestHandler } from 'express';
import multer from 'multer';
import * as videoService from '../services/video.service';
import { uploadThumbnail } from '../services/s3.service';
import { ValidationError, ForbiddenError } from '../utils/errors';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

interface VideoRequest extends AuthenticatedRequest {
  body: {
    title?: string;
    videoUrl?: string;
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

export async function createVideo(
  req: VideoRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new ForbiddenError('User ID not found in token');
    }

    const { title, videoUrl, isPublic } = req.body;
    const file = req.file;

    if (!title || !videoUrl) {
      throw new ValidationError('Title and video URL are required');
    }

    if (!file) {
      throw new ValidationError('Thumbnail file is required');
    }

    // Upload thumbnail to S3
    const thumbnailUrl = await uploadThumbnail(file.buffer, file.mimetype);

    const video = await videoService.createVideo(userId, {
      title,
      videoUrl,
      thumbnailUrl,
      isPublic: isPublic === 'true',
    });

    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
}

interface GetVideoRequest extends AuthenticatedRequest {
  params: {
    videoId: string;
  };
}

export async function getVideo(
  req: GetVideoRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { videoId } = req.params;
    const userId = req.userId;

    if (!videoId) {
      throw new ValidationError('Video ID is required');
    }

    const video = await videoService.getVideo(videoId, userId);

    res.json(video);
  } catch (error) {
    next(error);
  }
}

export async function getPublicVideos(
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const videos = await videoService.getPublicVideos();
    res.json(videos);
  } catch (error) {
    next(error);
  }
}
