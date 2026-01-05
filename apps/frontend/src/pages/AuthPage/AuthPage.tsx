import { useState } from 'react';
import { LogoSvg } from '@/components/common/LogoSvg/LogoSvg';
import './AuthPage.css';
import { Box, type TextInputProps } from '@markfoster314/marduk';
import {
  AuthFormTemplate,
  type AuthFormField,
  type AuthFormLink,
} from './AuthFormTemplate';

type AuthState = 'signin' | 'signup' | 'recovery';

export default function AuthPage() {
  const [authState, setAuthState] = useState<AuthState>('signin');

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
      onClick: () => setAuthState('recovery'),
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

  const recoveryFields: AuthFormField[] = [
    {
      id: 'recovery-code',
      name: 'recoveryCode',
      type: 'text' as TextInputProps['type'],
      label: 'Recovery Code',
      placeholder: 'Enter your recovery code',
      required: true,
    },
  ];

  const recoveryLinks: AuthFormLink[] = [
    {
      text: 'Back to Sign In',
      onClick: () => setAuthState('signin'),
    },
  ];

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle sign in
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle sign up
  };

  const handleRecovery = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle recovery code
  };

  return (
    <Box className="auth-page">
      <Box className="auth-card">
        <Box className="auth-logo">
          <LogoSvg animation="none" size={80} />
        </Box>

        <Box className="auth-content">
          {authState === 'signin' && (
            <AuthFormTemplate
              title="Sign In"
              fields={signinFields}
              submitButtonText="Sign In"
              links={signinLinks}
              onSubmit={handleSignIn}
            />
          )}

          {authState === 'signup' && (
            <AuthFormTemplate
              title="Sign Up"
              fields={signupFields}
              submitButtonText="Sign Up"
              links={signupLinks}
              onSubmit={handleSignUp}
            />
          )}

          {authState === 'recovery' && (
            <AuthFormTemplate
              title="Recovery Code"
              fields={recoveryFields}
              submitButtonText="Verify Code"
              links={recoveryLinks}
              onSubmit={handleRecovery}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
