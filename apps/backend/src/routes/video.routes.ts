import { Router, type IRouter } from 'express';
import * as videoController from '../controllers/video.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router: IRouter = Router();

// All video routes require authentication
router.use(authenticateToken);

// POST /api/video - Create video (with file upload)
router.post(
  '/',
  videoController.uploadThumbnailMiddleware,
  videoController.createVideo
);

// GET /api/video/public - Get all public videos
router.get('/public', videoController.getPublicVideos);

// GET /api/video/:videoId - Get video by ID
router.get('/:videoId', videoController.getVideo);

export default router;
