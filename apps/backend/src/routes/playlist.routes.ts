import { Router, type IRouter } from 'express';
import * as playlistController from '../controllers/playlist.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router: IRouter = Router();

// All playlist routes require authentication
router.use(authenticateToken);

// POST /api/playlist - Create playlist (with file upload)
router.post(
  '/',
  playlistController.uploadThumbnailMiddleware,
  playlistController.createPlaylist
);

// GET /api/playlist/public - Get all public playlists
router.get('/public', playlistController.getPublicPlaylists);

// GET /api/playlist/:playlistId - Get playlist by ID
router.get('/:playlistId', playlistController.getPlaylist);

export default router;
