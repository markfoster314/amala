import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoSvg } from '@/components/common/LogoSvg/LogoSvg';
import './AuthPage.css';
import { Box, Text, type TextInputProps } from '@markfoster314/marduk';
import {
  AuthFormTemplate,
  type AuthFormField,
  type AuthFormLink,
} from './AuthFormTemplate';
import { useAuth } from '@/contexts/AuthContext';

type AuthState =
  | 'signin'
  | 'signup'
  | 'verify'
  | 'forgotPassword'
  | 'resetPassword';

export default function AuthPage() {
  const navigate = useNavigate();
  const {
    signUp,
    confirmSignUp,
    signIn,
    forgotPassword,
    confirmPassword,
    resendConfirmationCode,
    error: authError,
    clearError,
    isLoading,
    isAuthenticated,
  } = useAuth();

  const [authState, setAuthState] = useState<AuthState>('signin');
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // Clear errors when state changes
  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [authState, clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line no-void
      void navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const displayError = authError ?? localError;

  const signinFields: AuthFormField[] = [
    {
      id: 'signin-email',
      name: 'email',
      type: 'email' as TextInputProps['type'],
      label: 'Email',
      required: true,
    },
    {
      id: 'signin-password',
      name: 'password',
      type: 'password' as TextInputProps['type'],
      label: 'Password',
      required: true,
    },
  ];

  const signinLinks: AuthFormLink[] = [
    {
      text: 'Forgot password?',
      onClick: () => setAuthState('forgotPassword'),
    },
    {
      text: "Don't have an account? Sign up",
      onClick: () => setAuthState('signup'),
    },
  ];

  const signupFields: AuthFormField[] = [
    {
      id: 'signup-email',
      name: 'email',
      type: 'email' as TextInputProps['type'],
      label: 'Email',
      required: true,
    },
    {
      id: 'signup-password',
      name: 'password',
      type: 'password' as TextInputProps['type'],
      label: 'Password',
      required: true,
    },
    {
      id: 'signup-confirm-password',
      name: 'confirmPassword',
      type: 'password' as TextInputProps['type'],
      label: 'Confirm Password',
      required: true,
    },
  ];

  const signupLinks: AuthFormLink[] = [
    {
      text: 'Already have an account? Sign in',
      onClick: () => setAuthState('signin'),
    },
  ];

  const verifyFields: AuthFormField[] = [
    {
      id: 'verify-code',
      name: 'code',
      type: 'text' as TextInputProps['type'],
      label: 'Verification Code',
      placeholder: 'Enter verification code',
      required: true,
    },
  ];

  const verifyLinks: AuthFormLink[] = [
    {
      text: 'Resend code',
      onClick: () => {
        if (email) {
          // eslint-disable-next-line no-void
          void (async () => {
            try {
              await resendConfirmationCode(email);
              setLocalError(null);
            } catch (_err) {
              // Error is handled by auth context
            }
          })();
        }
      },
    },
    {
      text: 'Back to Sign In',
      onClick: () => setAuthState('signin'),
    },
  ];

  const forgotPasswordFields: AuthFormField[] = [
    {
      id: 'forgot-password-email',
      name: 'email',
      type: 'email' as TextInputProps['type'],
      label: 'Email',
      placeholder: 'Enter your email address',
      required: true,
    },
  ];

  const forgotPasswordLinks: AuthFormLink[] = [
    {
      text: 'Back to Sign In',
      onClick: () => setAuthState('signin'),
    },
  ];

  const resetPasswordFields: AuthFormField[] = [
    {
      id: 'reset-code',
      name: 'code',
      type: 'text' as TextInputProps['type'],
      label: 'Reset Code',
      placeholder: 'Enter reset code',
      required: true,
    },
    {
      id: 'reset-new-password',
      name: 'newPassword',
      type: 'password' as TextInputProps['type'],
      label: 'New Password',
      required: true,
    },
    {
      id: 'reset-confirm-password',
      name: 'confirmPassword',
      type: 'password' as TextInputProps['type'],
      label: 'Confirm New Password',
      required: true,
    },
  ];

  const resetPasswordLinks: AuthFormLink[] = [
    {
      text: 'Back to Sign In',
      onClick: () => setAuthState('signin'),
    },
  ];

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line no-void
    void (async () => {
      setLocalError(null);
      clearError();

      const formData = new FormData(e.currentTarget);
      const emailValue = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!emailValue || !password) {
        setLocalError('Please fill in all fields');
        return;
      }

      try {
        await signIn(emailValue, password);
        // eslint-disable-next-line no-void
        void navigate('/dashboard');
      } catch (_err) {
        // Error is handled by auth context
      }
    })();
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line no-void
    void (async () => {
      setLocalError(null);
      clearError();

      const formData = new FormData(e.currentTarget);
      const emailValue = formData.get('email') as string;
      const password = formData.get('password') as string;
      const confirmPasswordValue = formData.get('confirmPassword') as string;

      if (!emailValue || !password || !confirmPasswordValue) {
        setLocalError('Please fill in all fields');
        return;
      }

      if (password !== confirmPasswordValue) {
        setLocalError('Passwords do not match');
        return;
      }

      try {
        await signUp(emailValue, password);
        setEmail(emailValue);
        setAuthState('verify');
      } catch (_err) {
        // Error is handled by auth context
      }
    })();
  };

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line no-void
    void (async () => {
      setLocalError(null);
      clearError();

      const formData = new FormData(e.currentTarget);
      const code = formData.get('code') as string;

      if (!code) {
        setLocalError('Please enter verification code');
        return;
      }

      if (!email) {
        setLocalError('Email not found. Please start over.');
        setAuthState('signin');
        return;
      }

      try {
        await confirmSignUp(email, code);
        setAuthState('signin');
        setLocalError(null);
      } catch (_err) {
        // Error is handled by auth context
      }
    })();
  };

  const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line no-void
    void (async () => {
      setLocalError(null);
      clearError();

      const formData = new FormData(e.currentTarget);
      const emailValue = formData.get('email') as string;

      if (!emailValue) {
        setLocalError('Please enter your email address');
        return;
      }

      try {
        await forgotPassword(emailValue);
        setEmail(emailValue);
        setAuthState('resetPassword');
      } catch (_err) {
        // Error is handled by auth context
      }
    })();
  };

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // eslint-disable-next-line no-void
    void (async () => {
      setLocalError(null);
      clearError();

      const formData = new FormData(e.currentTarget);
      const code = formData.get('code') as string;
      const newPassword = formData.get('newPassword') as string;
      const confirmPasswordValue = formData.get('confirmPassword') as string;

      if (!code || !newPassword || !confirmPasswordValue) {
        setLocalError('Please fill in all fields');
        return;
      }

      if (newPassword !== confirmPasswordValue) {
        setLocalError('Passwords do not match');
        return;
      }

      if (!email) {
        setLocalError('Email not found. Please start over.');
        setAuthState('signin');
        return;
      }

      try {
        await confirmPassword(email, code, newPassword);
        setAuthState('signin');
        setLocalError(null);
      } catch (_err) {
        // Error is handled by auth context
      }
    })();
  };

  return (
    <Box className="auth-page">
      <Box className="auth-card">
        <Box className="auth-logo">
          <LogoSvg animation="none" size={80} />
        </Box>

        <Box className="auth-content">
          {displayError && (
            <Box className="auth-error">
              <Text preset={['secondaryDark']}>{displayError}</Text>
            </Box>
          )}

          {authState === 'signin' && (
            <AuthFormTemplate
              title="Sign In"
              fields={signinFields}
              submitButtonText="Sign In"
              links={signinLinks}
              onSubmit={handleSignIn}
              isLoading={isLoading}
            />
          )}

          {authState === 'signup' && (
            <AuthFormTemplate
              title="Sign Up"
              fields={signupFields}
              submitButtonText="Sign Up"
              links={signupLinks}
              onSubmit={handleSignUp}
              isLoading={isLoading}
            />
          )}

          {authState === 'verify' && (
            <AuthFormTemplate
              title="Verify Email"
              fields={verifyFields}
              submitButtonText="Verify"
              links={verifyLinks}
              onSubmit={handleVerify}
              isLoading={isLoading}
            />
          )}

          {authState === 'forgotPassword' && (
            <AuthFormTemplate
              title="Forgot Password"
              fields={forgotPasswordFields}
              submitButtonText="Send Reset Code"
              links={forgotPasswordLinks}
              onSubmit={handleForgotPassword}
              isLoading={isLoading}
            />
          )}

          {authState === 'resetPassword' && (
            <AuthFormTemplate
              title="Reset Password"
              fields={resetPasswordFields}
              submitButtonText="Reset Password"
              links={resetPasswordLinks}
              onSubmit={handleResetPassword}
              isLoading={isLoading}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
