import { useState } from 'react';
import { LogoSvg } from '@/components/common/LogoSvg/LogoSvg';
import './AuthPage.css';
import { Box, Title } from '@markfoster314/marduk';

type AuthState = 'signin' | 'signup' | 'recovery';

export default function AuthPage() {
  const [authState, setAuthState] = useState<AuthState>('signin');

  return (
    <Box className="auth-page">
      <Box className="auth-card">
        <Box className="auth-logo">
          <LogoSvg animation="none" size={120} />
        </Box>

        <Box className="auth-content">
          {authState === 'signin' && (
            <Box className="auth-form">
              <Title level={2}>Sign In</Title>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle sign in
                }}
              >
                <Box className="form-group">
                  <label htmlFor="signin-email">Email</label>
                  <input type="email" id="signin-email" name="email" required />
                </Box>
                <Box className="form-group">
                  <label htmlFor="signin-password">Password</label>
                  <input
                    type="password"
                    id="signin-password"
                    name="password"
                    required
                  />
                </Box>
                <button type="submit" className="auth-button">
                  Sign In
                </button>
              </form>
              <Box className="auth-links">
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setAuthState('recovery')}
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setAuthState('signup')}
                >
                  Don't have an account? Sign up
                </button>
              </Box>
            </Box>
          )}

          {authState === 'signup' && (
            <Box className="auth-form">
              <Title level={2}>Sign Up</Title>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle sign up
                }}
              >
                <Box className="form-group">
                  <label htmlFor="signup-email">Email</label>
                  <input type="email" id="signup-email" name="email" required />
                </Box>
                <Box className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    type="password"
                    id="signup-password"
                    name="password"
                    required
                  />
                </Box>
                <Box className="form-group">
                  <label htmlFor="signup-confirm-password">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="signup-confirm-password"
                    name="confirmPassword"
                    required
                  />
                </Box>
                <button type="submit" className="auth-button">
                  Sign Up
                </button>
              </form>
              <Box className="auth-links">
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setAuthState('signin')}
                >
                  Already have an account? Sign in
                </button>
              </Box>
            </Box>
          )}

          {authState === 'recovery' && (
            <Box className="auth-form">
              <Title level={2}>Recovery Code</Title>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle recovery code
                }}
              >
                <Box className="form-group">
                  <label htmlFor="recovery-code">Recovery Code</label>
                  <input
                    type="text"
                    id="recovery-code"
                    name="recoveryCode"
                    placeholder="Enter your recovery code"
                    required
                  />
                </Box>
                <button type="submit" className="auth-button">
                  Verify Code
                </button>
              </form>
              <Box className="auth-links">
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setAuthState('signin')}
                >
                  Back to Sign In
                </button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
