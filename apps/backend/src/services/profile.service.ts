import { docClient, TABLE_NAME } from './dynamodb.service';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Profile, ProfileInput, ProfileUpdate, ProfileResponse } from '../types/profile.types';
import { NotFoundError, ValidationError } from '../utils/errors';

function createPK(userId: string): string {
  return `USER#${userId}`;
}

function parseUserId(pk: string): string {
  if (!pk.startsWith('USER#')) {
    throw new ValidationError('Invalid user ID format');
  }
  return pk.replace('USER#', '');
}

function validateProfileInput(input: ProfileInput): void {
  if (!input.username || typeof input.username !== 'string' || input.username.trim().length === 0) {
    throw new ValidationError('Username is required');
  }
  if (!input.displayname || typeof input.displayname !== 'string' || input.displayname.trim().length === 0) {
    throw new ValidationError('Display name is required');
  }
  if (input.description !== undefined && typeof input.description !== 'string') {
    throw new ValidationError('Description must be a string');
  }
}

/**
 * Check if a user profile exists without throwing an error
 */
export async function checkProfileExists(userId: string): Promise<boolean> {
  const pk = createPK(userId);
  
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: pk,
      SK: 'PROFILE',
    },
  });

  const response = await docClient.send(command);
  return !!response.Item;
}

export async function getUserProfile(userId: string): Promise<ProfileResponse> {
  const pk = createPK(userId);
  
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: pk,
      SK: 'PROFILE',
    },
  });

  const response = await docClient.send(command);

  if (!response.Item) {
    throw new NotFoundError('Profile not found');
  }

  const profile = response.Item as Profile;
  const extractedUserId = parseUserId(profile.PK);

  return {
    userId: extractedUserId,
    username: profile.username,
    displayname: profile.displayname,
    description: profile.description,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export async function createUserProfile(
  userId: string,
  profileData: ProfileInput
): Promise<ProfileResponse> {
  validateProfileInput(profileData);

  const pk = createPK(userId);
  const now = new Date().toISOString();

  const profile: Profile = {
    PK: pk,
    SK: 'PROFILE',
    username: profileData.username.trim(),
    displayname: profileData.displayname.trim(),
    description: profileData.description?.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: profile,
  });

  await docClient.send(command);

  return {
    userId,
    username: profile.username,
    displayname: profile.displayname,
    description: profile.description,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export async function updateUserProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<ProfileResponse> {
  const pk = createPK(userId);
  const now = new Date().toISOString();

  // Build update expression
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  if (updates.username !== undefined) {
    if (typeof updates.username !== 'string' || updates.username.trim().length === 0) {
      throw new ValidationError('Username cannot be empty');
    }
    updateExpressions.push('#username = :username');
    expressionAttributeNames['#username'] = 'username';
    expressionAttributeValues[':username'] = updates.username.trim();
  }

  if (updates.displayname !== undefined) {
    if (typeof updates.displayname !== 'string' || updates.displayname.trim().length === 0) {
      throw new ValidationError('Display name cannot be empty');
    }
    updateExpressions.push('#displayname = :displayname');
    expressionAttributeNames['#displayname'] = 'displayname';
    expressionAttributeValues[':displayname'] = updates.displayname.trim();
  }

  if (updates.description !== undefined) {
    if (typeof updates.description !== 'string') {
      throw new ValidationError('Description must be a string');
    }
    updateExpressions.push('#description = :description');
    expressionAttributeNames['#description'] = 'description';
    expressionAttributeValues[':description'] = updates.description.trim() || null;
  }

  if (updateExpressions.length === 0) {
    // No updates provided, just return existing profile
    return getUserProfile(userId);
  }

  // Always update the updatedAt timestamp
  updateExpressions.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = now;

  const updateExpression = `SET ${updateExpressions.join(', ')}`;

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: pk,
      SK: 'PROFILE',
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  });

  try {
    const response = await docClient.send(command);
    
    if (!response.Attributes) {
      throw new NotFoundError('Profile not found');
    }

    const profile = response.Attributes as Profile;
    const extractedUserId = parseUserId(profile.PK);

    return {
      userId: extractedUserId,
      username: profile.username,
      displayname: profile.displayname,
      description: profile.description,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ResourceNotFoundException') {
      throw new NotFoundError('Profile not found');
    }
    throw error;
  }
}
