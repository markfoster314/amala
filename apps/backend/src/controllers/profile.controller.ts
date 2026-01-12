import type { Response, NextFunction } from 'express';
import * as profileService from '../services/profile.service';
import { ValidationError, ForbiddenError } from '../utils/errors';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

interface ProfileRequest extends AuthenticatedRequest {
  params: {
    userId: string;
  };
  body: {
    username?: string;
    displayname?: string;
    description?: string;
  };
}

export async function getProfile(
  req: ProfileRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.userId;

    console.log(
      `[${new Date().toISOString()}] GET Profile - Requested userId: ${userId}, Authenticated userId: ${authenticatedUserId}`
    );

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const profile = await profileService.getUserProfile(userId);
    console.log(
      `[${new Date().toISOString()}] GET Profile - Success for userId: ${userId}`
    );
    res.json(profile);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] GET Profile - Error:`,
      error instanceof Error ? error.message : String(error)
    );
    next(error);
  }
}

export async function createProfile(
  req: ProfileRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new ForbiddenError('User ID not found in token');
    }

    const { username, displayname, description } = req.body;

    if (!username || !displayname) {
      throw new ValidationError('Username and displayname are required');
    }

    const profile = await profileService.createUserProfile(userId, {
      username,
      displayname,
      description,
    });

    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: ProfileRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId: requestedUserId } = req.params;
    const authenticatedUserId = req.userId;

    if (!authenticatedUserId) {
      throw new ForbiddenError('User ID not found in token');
    }

    if (requestedUserId !== authenticatedUserId) {
      throw new ForbiddenError('You can only update your own profile');
    }

    const { username, displayname, description } = req.body;

    const profile = await profileService.updateUserProfile(
      authenticatedUserId,
      {
        username,
        displayname,
        description,
      }
    );

    res.json(profile);
  } catch (error) {
    next(error);
  }
}
