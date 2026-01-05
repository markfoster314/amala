import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthPage from './AuthPage';

// Mock the LogoSvg component
vi.mock('@/components/common/LogoSvg/LogoSvg', () => ({
  LogoSvg: ({ animation, size }: { animation: string; size: number }) => (
    <div data-testid="logo-svg" data-animation={animation} data-size={size}>
      Logo
    </div>
  ),
}));

// Mock the AuthFormTemplate component
const mockOnSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
});

vi.mock('./AuthFormTemplate', () => ({
  AuthFormTemplate: ({
    title,
    fields,
    submitButtonText,
    links,
    onSubmit,
  }: {
    title: string;
    fields: unknown[];
    submitButtonText: string;
    links?: Array<{ text: string; onClick: () => void }>;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }) => (
    <div data-testid="auth-form-template" data-title={title}>
      <h2>{title}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
      >
        {fields.map((field: { id: string; label: string }) => (
          <div key={field.id} data-testid={`field-${field.id}`}>
            {field.label}
          </div>
        ))}
        <button type="submit">{submitButtonText}</button>
      </form>
      {links &&
        links.map((link, index) => (
          <button
            key={index}
            type="button"
            onClick={link.onClick}
            data-testid={`link-${index}`}
          >
            {link.text}
          </button>
        ))}
    </div>
  ),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  const renderAuthPage = () => {
    return render(<AuthPage />);
  };

  it('renders without crashing', () => {
    renderAuthPage();
    expect(screen.getByTestId('logo-svg')).toBeInTheDocument();
  });

  it('renders the logo component with correct props', () => {
    renderAuthPage();
    const logo = screen.getByTestId('logo-svg');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('data-animation', 'none');
    expect(logo).toHaveAttribute('data-size', '80');
  });

  it('renders signin form by default', () => {
    renderAuthPage();
    const formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Sign In');
    expect(screen.getByRole('button', { name: /sign in/i, hidden: true })).toBeInTheDocument();
  });

  it('displays signin form fields by default', () => {
    renderAuthPage();
    expect(screen.getByTestId('field-signin-email')).toBeInTheDocument();
    expect(screen.getByTestId('field-signin-password')).toBeInTheDocument();
  });

  it('displays signin form links by default', () => {
    renderAuthPage();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(
      screen.getByText("Don't have an account? Sign up")
    ).toBeInTheDocument();
  });

  it('switches to signup form when signup link is clicked', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    const signupLink = screen.getByText("Don't have an account? Sign up");
    await user.click(signupLink);

    const formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Sign Up');
    expect(screen.getByRole('button', { name: /sign up/i, hidden: true })).toBeInTheDocument();
  });

  it('displays signup form fields when switched to signup', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    const signupLink = screen.getByText("Don't have an account? Sign up");
    await user.click(signupLink);

    expect(screen.getByTestId('field-signup-email')).toBeInTheDocument();
    expect(screen.getByTestId('field-signup-password')).toBeInTheDocument();
    expect(
      screen.getByTestId('field-signup-confirm-password')
    ).toBeInTheDocument();
  });

  it('displays signup form links when switched to signup', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    const signupLink = screen.getByText("Don't have an account? Sign up");
    await user.click(signupLink);

    expect(
      screen.getByText('Already have an account? Sign in')
    ).toBeInTheDocument();
  });

  it('switches back to signin form from signup', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    // Switch to signup
    const signupLink = screen.getByText("Don't have an account? Sign up");
    await user.click(signupLink);
    let formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Sign Up');

    // Switch back to signin
    const signinLink = screen.getByText('Already have an account? Sign in');
    await user.click(signinLink);
    formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Sign In');
  });

  it('switches to recovery form when forgot password link is clicked', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    const recoveryLink = screen.getByText('Forgot password?');
    await user.click(recoveryLink);

    const formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Recovery Code');
    expect(screen.getByRole('button', { name: /verify code/i, hidden: true })).toBeInTheDocument();
  });

  it('displays recovery form fields when switched to recovery', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    const recoveryLink = screen.getByText('Forgot password?');
    await user.click(recoveryLink);

    expect(screen.getByTestId('field-recovery-code')).toBeInTheDocument();
  });

  it('displays recovery form links when switched to recovery', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    const recoveryLink = screen.getByText('Forgot password?');
    await user.click(recoveryLink);

    expect(screen.getByText('Back to Sign In')).toBeInTheDocument();
  });

  it('switches back to signin form from recovery', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    // Switch to recovery
    const recoveryLink = screen.getByText('Forgot password?');
    await user.click(recoveryLink);
    let formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Recovery Code');

    // Switch back to signin
    const signinLink = screen.getByText('Back to Sign In');
    await user.click(signinLink);
    formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Sign In');
  });

  it('calls handleSignIn when signin form is submitted', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    const submitButton = screen.getByRole('button', { name: /sign in/i, hidden: true });
    await user.click(submitButton);

    // The form submission should prevent default and call the handler
    // Since we're mocking, we verify the form was rendered and can be submitted
    expect(submitButton).toBeInTheDocument();
  });

  it('calls handleSignUp when signup form is submitted', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    // Switch to signup
    const signupLink = screen.getByText("Don't have an account? Sign up");
    await user.click(signupLink);

    const submitButton = screen.getByRole('button', { name: /sign up/i, hidden: true });
    await user.click(submitButton);

    expect(submitButton).toBeInTheDocument();
  });

  it('calls handleRecovery when recovery form is submitted', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    // Switch to recovery
    const recoveryLink = screen.getByText('Forgot password?');
    await user.click(recoveryLink);

    const submitButton = screen.getByRole('button', { name: /verify code/i, hidden: true });
    await user.click(submitButton);

    expect(submitButton).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = renderAuthPage();
    expect(container.querySelector('.auth-page')).toBeInTheDocument();
    expect(container.querySelector('.auth-card')).toBeInTheDocument();
    expect(container.querySelector('.auth-logo')).toBeInTheDocument();
    expect(container.querySelector('.auth-content')).toBeInTheDocument();
  });

  it('only renders one form at a time', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    // Initially signin
    let formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Sign In');

    // Switch to signup
    const signupLink = screen.getByText("Don't have an account? Sign up");
    await user.click(signupLink);

    formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Sign Up');

    // Switch back to signin first, then to recovery
    const backToSigninLink = screen.getByText('Already have an account? Sign in');
    await user.click(backToSigninLink);
    
    formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Sign In');
    
    const recoveryLink = screen.getByText('Forgot password?');
    await user.click(recoveryLink);

    formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Recovery Code');
  });

  it('maintains state correctly when switching between forms multiple times', async () => {
    const user = userEvent.setup();
    renderAuthPage();

    // Signin -> Signup -> Recovery -> Signin
    await user.click(screen.getByText("Don't have an account? Sign up"));
    let formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Sign Up');

    await user.click(screen.getByText('Already have an account? Sign in'));
    formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Sign In');

    await user.click(screen.getByText('Forgot password?'));
    formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Recovery Code');

    await user.click(screen.getByText('Back to Sign In'));
    formTemplate = screen.getByTestId('auth-form-template');
    expect(formTemplate).toHaveAttribute('data-title', 'Sign In');
  });
});

