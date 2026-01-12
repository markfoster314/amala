import { getSession } from './cognito';

// Profile types matching backend types
export interface ProfileResponse {
  userId: string;
  username: string;
  displayname: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileInput {
  username: string;
  displayname: string;
  description?: string;
}

export interface ProfileUpdate {
  username?: string;
  displayname?: string;
  description?: string;
}

const API_BASE_URL: string =
  typeof import.meta.env['VITE_API_URL'] === 'string'
    ? import.meta.env['VITE_API_URL']
    : 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get the ID token from the current Cognito session
 */
async function getIdToken(): Promise<string> {
  const session = await getSession();
  if (!session) {
    throw new ApiError('No active session', 401, 'NO_SESSION');
  }

  const idToken = session.getIdToken();
  return idToken.getJwtToken();
}

/**
 * Base API client that adds authentication headers
 */
async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getIdToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let errorCode: string | undefined;

    try {
      const errorData = (await response.json()) as {
        error?: { message?: string; code?: string };
      };
      errorMessage = errorData.error?.message ?? errorMessage;
      errorCode = errorData.error?.code;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, response.status, errorCode);
  }

  // Handle empty responses (e.g., 204 No Content)
  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

/**
 * Get user profile by userId
 */
export async function getProfile(userId: string): Promise<ProfileResponse> {
  return apiClient<ProfileResponse>(
    `/api/profile/${encodeURIComponent(userId)}`
  );
}

/**
 * Create a new user profile (uses userId from token)
 */
export async function createProfile(
  data: ProfileInput
): Promise<ProfileResponse> {
  return apiClient<ProfileResponse>('/api/profile', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  data: ProfileUpdate
): Promise<ProfileResponse> {
  return apiClient<ProfileResponse>(
    `/api/profile/${encodeURIComponent(userId)}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
}
