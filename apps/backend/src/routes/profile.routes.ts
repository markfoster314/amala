import { Router, type IRouter } from 'express';
import * as profileController from '../controllers/profile.controller';
import { authenticateToken } from '../middleware/auth.middleware';
const router: IRouter = Router();

// All profile routes require authentication
router.use(authenticateToken);

// GET /api/profile/:userId - Get user profile
router.get('/:userId', profileController.getProfile);

// POST /api/profile - Create user profile (uses userId from token)
router.post('/', profileController.createProfile);

// PUT /api/profile/:userId - Update user profile (userId must match token)
router.put('/:userId', profileController.updateProfile);

export default router;
