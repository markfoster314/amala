import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  type ISignUpResult,
  type CognitoUserSession,
} from 'amazon-cognito-identity-js';

// Initialize User Pool with environment variables
const userPoolId =
  typeof import.meta.env['VITE_AWS_COGNITO_USER_POOL_ID'] === 'string'
    ? import.meta.env['VITE_AWS_COGNITO_USER_POOL_ID']
    : '';

const clientId =
  typeof import.meta.env['VITE_AWS_COGNITO_CLIENT_ID'] === 'string'
    ? import.meta.env['VITE_AWS_COGNITO_CLIENT_ID']
    : '';

const poolData: { UserPoolId: string; ClientId: string } = {
  UserPoolId: userPoolId,
  ClientId: clientId,
};

export const userPool = new CognitoUserPool(poolData);

// Error type for better error handling
export class CognitoError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'CognitoError';
  }
}

// Helper function to extract error code safely
function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  ) {
    return (error as { code: string }).code;
  }
  return undefined;
}

// Helper function to get user-friendly error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const errorMessage = error.message;
    const errorCode = getErrorCode(error);

    // Map common Cognito error codes to user-friendly messages
    switch (errorCode) {
      case 'UserNotConfirmedException':
        return 'Please verify your email address before signing in.';
      case 'NotAuthorizedException':
        return 'Incorrect email or password.';
      case 'UserNotFoundException':
        return 'No account found with this email address.';
      case 'CodeMismatchException':
        return 'Invalid verification code. Please try again.';
      case 'ExpiredCodeException':
        return 'Verification code has expired. Please request a new one.';
      case 'InvalidPasswordException':
        return 'Password does not meet requirements.';
      case 'UsernameExistsException':
        return 'An account with this email already exists.';
      case 'LimitExceededException':
        return 'Too many attempts. Please try again later.';
      case 'InvalidParameterException':
        return 'Invalid input. Please check your information.';
      default:
        return errorMessage || 'An error occurred. Please try again.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}

// Helper function to create CognitoUser instance
function getCognitoUser(username: string): CognitoUser {
  return new CognitoUser({
    Username: username,
    Pool: userPool,
  });
}

// Sign up a new user
export async function signUp(
  email: string,
  password: string,
  attributes: Record<string, string> = {}
): Promise<ISignUpResult> {
  return new Promise((resolve, reject) => {
    const attributeList: CognitoUserAttribute[] = Object.entries(
      attributes
    ).map(
      ([key, value]) =>
        new CognitoUserAttribute({
          Name: key,
          Value: value,
        })
    );

    // Always include email attribute
    if (!attributes['email']) {
      attributeList.push(
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        })
      );
    }

    userPool.signUp(email, password, attributeList, [], (error, result) => {
      if (error) {
        const code = getErrorCode(error);
        const errorInstance =
          error instanceof Error
            ? error
            : new Error(
                typeof error === 'string'
                  ? error
                  : JSON.stringify(error) || 'Unknown error'
              );
        reject(new CognitoError(getErrorMessage(error), code, errorInstance));
        return;
      }
      if (!result) {
        reject(new CognitoError('Sign up failed: No result returned'));
        return;
      }
      resolve(result);
    });
  });
}

// Confirm sign up with verification code
export async function confirmSignUp(
  email: string,
  code: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUser(email);

    cognitoUser.confirmRegistration(code, true, (error: unknown) => {
      if (error) {
        const errorCode = getErrorCode(error);
        const errorInstance =
          error instanceof Error
            ? error
            : new Error(
                typeof error === 'string'
                  ? error
                  : JSON.stringify(error) || 'Unknown error'
              );
        reject(
          new CognitoError(getErrorMessage(error), errorCode, errorInstance)
        );
        return;
      }
      resolve();
    });
  });
}

// Resend confirmation code
export async function resendConfirmationCode(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUser(email);

    cognitoUser.resendConfirmationCode((error: unknown) => {
      if (error) {
        const errorCode = getErrorCode(error);
        const errorInstance =
          error instanceof Error
            ? error
            : new Error(
                typeof error === 'string'
                  ? error
                  : JSON.stringify(error) || 'Unknown error'
              );
        reject(
          new CognitoError(getErrorMessage(error), errorCode, errorInstance)
        );
        return;
      }
      resolve();
    });
  });
}

// Sign in user
export async function signIn(
  email: string,
  password: string
): Promise<CognitoUserSession> {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = getCognitoUser(email);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        resolve(session);
      },
      onFailure: (error) => {
        const errorCode = getErrorCode(error);
        const errorInstance =
          error instanceof Error
            ? error
            : new Error(
                typeof error === 'string'
                  ? error
                  : JSON.stringify(error) || 'Unknown error'
              );
        reject(
          new CognitoError(getErrorMessage(error), errorCode, errorInstance)
        );
      },
    });
  });
}

// Sign out current user
export async function signOut(): Promise<void> {
  return new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });
}

// Get current authenticated user
export function getCurrentUser(): CognitoUser | null {
  return userPool.getCurrentUser();
}

// Get current session (tokens)
export async function getSession(): Promise<CognitoUserSession | null> {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCurrentUser();
    if (!cognitoUser) {
      resolve(null);
      return;
    }

    cognitoUser.getSession(
      (error: Error | null, session: CognitoUserSession | null) => {
        if (error) {
          const errorCode = getErrorCode(error);
          reject(new CognitoError(getErrorMessage(error), errorCode, error));
          return;
        }
        resolve(session);
      }
    );
  });
}

// Refresh session tokens
export async function refreshSession(): Promise<CognitoUserSession> {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCurrentUser();
    if (!cognitoUser) {
      reject(new CognitoError('No user is currently signed in'));
      return;
    }

    cognitoUser.getSession(
      (error: Error | null, session: CognitoUserSession | null) => {
        if (error) {
          const errorCode = getErrorCode(error);
          reject(new CognitoError(getErrorMessage(error), errorCode, error));
          return;
        }

        if (!session?.isValid()) {
          const refreshToken = session?.getRefreshToken();
          if (!refreshToken) {
            reject(new CognitoError('No refresh token available'));
            return;
          }

          cognitoUser.refreshSession(
            refreshToken,
            (refreshError, newSession: CognitoUserSession | undefined) => {
              if (refreshError) {
                const errorCode = getErrorCode(refreshError);
                const errorInstance =
                  refreshError instanceof Error
                    ? refreshError
                    : new Error(
                        typeof refreshError === 'string'
                          ? refreshError
                          : JSON.stringify(refreshError) || 'Unknown error'
                      );
                reject(
                  new CognitoError(
                    getErrorMessage(refreshError),
                    errorCode,
                    errorInstance
                  )
                );
                return;
              }
              if (!newSession) {
                reject(new CognitoError('Failed to refresh session'));
                return;
              }
              resolve(newSession);
            }
          );
        } else {
          resolve(session);
        }
      }
    );
  });
}

// Initiate forgot password flow
export async function forgotPassword(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUser(email);

    cognitoUser.forgotPassword({
      onSuccess: () => {
        resolve();
      },
      onFailure: (error) => {
        const errorCode = getErrorCode(error);
        const errorInstance =
          error instanceof Error
            ? error
            : new Error(
                typeof error === 'string'
                  ? error
                  : JSON.stringify(error) || 'Unknown error'
              );
        reject(
          new CognitoError(getErrorMessage(error), errorCode, errorInstance)
        );
      },
    });
  });
}

// Confirm password reset with code and new password
export async function confirmPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUser(email);

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        resolve();
      },
      onFailure: (error) => {
        const errorCode = getErrorCode(error);
        const errorInstance =
          error instanceof Error
            ? error
            : new Error(
                typeof error === 'string'
                  ? error
                  : JSON.stringify(error) || 'Unknown error'
              );
        reject(
          new CognitoError(getErrorMessage(error), errorCode, errorInstance)
        );
      },
    });
  });
}

// Change password for authenticated user
export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCurrentUser();
    if (!cognitoUser) {
      reject(new CognitoError('No user is currently signed in'));
      return;
    }

    cognitoUser.getSession(
      (error: Error | null, session: CognitoUserSession | null) => {
        if (error) {
          const errorCode = getErrorCode(error);
          reject(new CognitoError(getErrorMessage(error), errorCode, error));
          return;
        }

        if (!session?.isValid()) {
          reject(new CognitoError('Session is not valid'));
          return;
        }

        cognitoUser.changePassword(oldPassword, newPassword, (changeError) => {
          if (changeError) {
            const errorCode = getErrorCode(changeError);
            const errorInstance =
              changeError instanceof Error
                ? changeError
                : new Error(
                    typeof changeError === 'string'
                      ? changeError
                      : JSON.stringify(changeError) || 'Unknown error'
                  );
            reject(
              new CognitoError(
                getErrorMessage(changeError),
                errorCode,
                errorInstance
              )
            );
            return;
          }
          resolve();
        });
      }
    );
  });
}

export async function getUserId(): Promise<string | null> {
  try {
    const session = await getSession();
    if (!session) {
      return null;
    }

    const idToken = session.getIdToken();
    const payload = idToken.decodePayload();

    // The 'sub' claim is the unique user ID (UUID)
    const userId = payload['sub'] as string | undefined;
    return userId ?? null;
  } catch (_err) {
    return null;
  }
}
