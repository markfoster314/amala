import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthFormTemplate, type AuthFormField, type AuthFormLink } from './AuthFormTemplate';

describe('AuthFormTemplate', () => {
  const mockOnSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  });

  const defaultFields: AuthFormField[] = [
    {
      id: 'test-email',
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      id: 'test-password',
      name: 'password',
      type: 'password',
      label: 'Password',
      required: true,
    },
  ];

  const defaultLinks: AuthFormLink[] = [
    {
      text: 'Test Link',
      onClick: vi.fn(),
    },
  ];

  it('renders without crashing', () => {
    render(
      <AuthFormTemplate
        title="Test Title"
        fields={defaultFields}
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('displays the title correctly', () => {
    render(
      <AuthFormTemplate
        title="Sign In"
        fields={defaultFields}
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    const { container } = render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(container.querySelector('#test-email')).toBeInTheDocument();
    expect(container.querySelector('#test-password')).toBeInTheDocument();
  });

  it('renders fields with correct attributes', () => {
    const fields: AuthFormField[] = [
      {
        id: 'test-input',
        name: 'testName',
        type: 'text',
        label: 'Test Input',
        placeholder: 'Enter text',
        required: false,
      },
    ];

    render(
      <AuthFormTemplate
        title="Test"
        fields={fields}
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Test Input')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'testName');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('renders required fields correctly', () => {
    const fields: AuthFormField[] = [
      {
        id: 'required-field',
        name: 'required',
        type: 'text',
        label: 'Required Field',
        required: true,
      },
    ];

    render(
      <AuthFormTemplate
        title="Test"
        fields={fields}
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Required Field')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('renders optional fields correctly', () => {
    const fields: AuthFormField[] = [
      {
        id: 'optional-field',
        name: 'optional',
        type: 'text',
        label: 'Optional Field',
        required: false,
      },
    ];

    render(
      <AuthFormTemplate
        title="Test"
        fields={fields}
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Optional Field')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).not.toBeRequired();
  });

  it('renders submit button with correct text', () => {
    render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Sign In"
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );

    const form = container.querySelector('form') as HTMLFormElement;
    expect(form).toBeInTheDocument();
    
    // Fire submit event directly on the form
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    expect(mockOnSubmit).toHaveBeenCalledOnce();
  });

  it('calls onSubmit when Enter is pressed in a field', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );

    const emailInput = container.querySelector('#test-email') as HTMLInputElement;
    expect(emailInput).not.toBeNull();
    await user.type(emailInput, 'test@example.com');
    
    // Press Enter in the input field
    await user.type(emailInput, '{Enter}');

    expect(mockOnSubmit).toHaveBeenCalledOnce();
  });

  it('renders links when provided', () => {
    render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Submit"
        links={defaultLinks}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('does not render links section when links are not provided', () => {
    const { container } = render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );

    const linksContainer = container.querySelector('.auth-links');
    expect(linksContainer).not.toBeInTheDocument();
  });

  it('does not render links section when links array is empty', () => {
    const { container } = render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Submit"
        links={[]}
        onSubmit={mockOnSubmit}
      />
    );

    const linksContainer = container.querySelector('.auth-links');
    expect(linksContainer).not.toBeInTheDocument();
  });

  it('renders multiple links when provided', () => {
    const links: AuthFormLink[] = [
      {
        text: 'First Link',
        onClick: vi.fn(),
      },
      {
        text: 'Second Link',
        onClick: vi.fn(),
      },
    ];

    render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Submit"
        links={links}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('First Link')).toBeInTheDocument();
    expect(screen.getByText('Second Link')).toBeInTheDocument();
  });

  it('calls onClick handler when link is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    const links: AuthFormLink[] = [
      {
        text: 'Test Link',
        onClick: mockOnClick,
      },
    ];

    render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Submit"
        links={links}
        onSubmit={mockOnSubmit}
      />
    );

    const link = screen.getByText('Test Link');
    await user.click(link);

    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it('calls correct onClick handler for each link', async () => {
    const user = userEvent.setup();
    const mockOnClick1 = vi.fn();
    const mockOnClick2 = vi.fn();
    const links: AuthFormLink[] = [
      {
        text: 'First Link',
        onClick: mockOnClick1,
      },
      {
        text: 'Second Link',
        onClick: mockOnClick2,
      },
    ];

    render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Submit"
        links={links}
        onSubmit={mockOnSubmit}
      />
    );

    await user.click(screen.getByText('First Link'));
    expect(mockOnClick1).toHaveBeenCalledOnce();
    expect(mockOnClick2).not.toHaveBeenCalled();

    await user.click(screen.getByText('Second Link'));
    expect(mockOnClick2).toHaveBeenCalledOnce();
  });

  it('renders fields with different input types', () => {
    const fields: AuthFormField[] = [
      {
        id: 'email-field',
        name: 'email',
        type: 'email',
        label: 'Email',
      },
      {
        id: 'password-field',
        name: 'password',
        type: 'password',
        label: 'Password',
      },
      {
        id: 'text-field',
        name: 'text',
        type: 'text',
        label: 'Text',
      },
    ];

    const { container } = render(
      <AuthFormTemplate
        title="Test"
        fields={fields}
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );

    const emailInput = container.querySelector('#email-field');
    expect(emailInput).toHaveAttribute('type', 'email');
    
    const passwordInput = container.querySelector('#password-field');
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    const textInput = container.querySelector('#text-field');
    expect(textInput).toHaveAttribute('type', 'text');
  });

  it('has correct CSS classes', () => {
    const { container } = render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Submit"
        links={defaultLinks}
        onSubmit={mockOnSubmit}
      />
    );

    expect(container.querySelector('.auth-form')).toBeInTheDocument();
    expect(container.querySelector('.form-group')).toBeInTheDocument();
    expect(container.querySelector('.auth-links')).toBeInTheDocument();
  });

  it('renders form with correct structure', () => {
    const { container } = render(
      <AuthFormTemplate
        title="Test"
        fields={defaultFields}
        submitButtonText="Submit"
        onSubmit={mockOnSubmit}
      />
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    expect(form?.querySelectorAll('.form-group')).toHaveLength(2);
    expect(form?.querySelector('button[type="submit"]')).toBeInTheDocument();
  });
});

