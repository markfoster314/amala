import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { CognitoUser } from 'amazon-cognito-identity-js';
import {
  getCurrentUser,
  getSession,
  signIn as cognitoSignIn,
  signUp as cognitoSignUp,
  confirmSignUp as cognitoConfirmSignUp,
  resendConfirmationCode as cognitoResendConfirmationCode,
  signOut as cognitoSignOut,
  forgotPassword as cognitoForgotPassword,
  confirmPassword as cognitoConfirmPassword,
  refreshSession,
  CognitoError,
  getUserId,
} from '@/lib/cognito';
import { getProfile, createProfile, ApiError } from '@/lib/api';

interface AuthContextType {
  user: CognitoUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (
    email: string,
    password: string,
    attributes?: Record<string, string>
  ) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const session = await getSession();
          if (session) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (_err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    // eslint-disable-next-line no-void
    void checkSession();
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sign up
  const handleSignUp = useCallback(
    async (
      email: string,
      password: string,
      attributes: Record<string, string> = {}
    ) => {
      try {
        setError(null);
        setIsLoading(true);
        await cognitoSignUp(email, password, attributes);
      } catch (err) {
        const errorMessage =
          err instanceof CognitoError
            ? err.message
            : 'Failed to sign up. Please try again.';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Confirm sign up
  const handleConfirmSignUp = useCallback(
    async (email: string, code: string) => {
      try {
        setError(null);
        setIsLoading(true);
        await cognitoConfirmSignUp(email, code);
      } catch (err) {
        const errorMessage =
          err instanceof CognitoError
            ? err.message
            : 'Failed to confirm sign up. Please try again.';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Sign in
  const handleSignIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await cognitoSignIn(email, password);
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);

        // Check if profile exists, create if missing
        // Don't block auth flow if profile creation fails
        try {
          const userId = await getUserId();
          if (userId) {
            try {
              await getProfile(userId);
              // Profile exists, nothing to do
            } catch (profileError) {
              // Profile doesn't exist (404) or other error
              if (
                profileError instanceof ApiError &&
                profileError.statusCode === 404
              ) {
                // Extract username from email (part before @)
                const usernameFromEmail = email.split('@')[0] ?? email;
                const displaynameFromEmail = email;

                // Create profile with defaults
                await createProfile({
                  username: usernameFromEmail,
                  displayname: displaynameFromEmail,
                  description: '',
                });
              }
              // For other errors, just log but don't throw
              // We don't want to block the sign-in flow
            }
          }
        } catch (_profileErr) {
          // Silently fail profile creation/check - don't block authentication
          // eslint-disable-next-line no-console
          console.warn(
            'Failed to check/create profile after sign-in:',
            _profileErr
          );
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof CognitoError
          ? err.message
          : 'Failed to sign in. Please try again.';
      setError(errorMessage);
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out
  const handleSignOut = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      await cognitoSignOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      const errorMessage =
        err instanceof CognitoError
          ? err.message
          : 'Failed to sign out. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Forgot password
  const handleForgotPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await cognitoForgotPassword(email);
    } catch (err) {
      const errorMessage =
        err instanceof CognitoError
          ? err.message
          : 'Failed to send password reset code. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Confirm password
  const handleConfirmPassword = useCallback(
    async (email: string, code: string, newPassword: string) => {
      try {
        setError(null);
        setIsLoading(true);
        await cognitoConfirmPassword(email, code, newPassword);
      } catch (err) {
        const errorMessage =
          err instanceof CognitoError
            ? err.message
            : 'Failed to reset password. Please try again.';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Resend confirmation code
  const handleResendConfirmationCode = useCallback(async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await cognitoResendConfirmationCode(email);
    } catch (err) {
      const errorMessage =
        err instanceof CognitoError
          ? err.message
          : 'Failed to resend confirmation code. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh session periodically
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const refreshInterval = setInterval(
      () => {
        // eslint-disable-next-line no-void
        void (async () => {
          try {
            const session = await getSession();
            if (!session?.isValid()) {
              await refreshSession();
            }
          } catch (_err) {
            // If refresh fails, user may need to sign in again
            // Don't set error here to avoid interrupting user experience
            // The session check on mount will handle it
          }
        })();
      },
      5 * 60 * 1000
    ); // Refresh every 5 minutes

    return () => {
      clearInterval(refreshInterval);
    };
  }, [isAuthenticated]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    forgotPassword: handleForgotPassword,
    confirmPassword: handleConfirmPassword,
    resendConfirmationCode: handleResendConfirmationCode,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
