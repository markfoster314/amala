import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock marduk components
vi.mock('@markfoster314/marduk', () => ({
  Box: ({
    className,
    preset,
    children,
  }: {
    className?: string;
    preset?: string[];
    children: React.ReactNode;
  }) => (
    <div
      data-testid={preset ? 'box-stack' : 'box'}
      className={className}
      data-preset={preset?.join(',')}
    >
      {children}
    </div>
  ),
  Title: ({
    preset,
    level,
    children,
  }: {
    preset?: string[];
    level?: number;
    children: React.ReactNode;
  }) => (
    <h1 data-testid="title" data-preset={preset?.join(',')} data-level={level}>
      {children}
    </h1>
  ),
  Text: ({
    preset,
    children,
  }: {
    preset?: string[];
    children: React.ReactNode;
  }) => (
    <p data-testid="text" data-preset={preset?.join(',')}>
      {children}
    </p>
  ),
  Button: ({
    onClick,
    preset,
    className,
    children,
  }: {
    onClick?: () => void;
    preset?: string[];
    className?: string;
    children: React.ReactNode;
  }) => (
    <button
      data-testid="button"
      onClick={onClick}
      className={className}
      data-preset={preset?.join(',')}
    >
      {children}
    </button>
  ),
}));

describe('NotFound', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderNotFound = () => {
    return render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
  };

  it('renders without crashing', () => {
    renderNotFound();
    expect(screen.getByText('404 - Not Found')).toBeInTheDocument();
  });

  it('displays the 404 title', () => {
    renderNotFound();
    const title = screen.getByText('404 - Not Found');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H1');
  });

  it('displays the error message', () => {
    renderNotFound();
    expect(
      screen.getByText("The page you're looking for doesn't exist.")
    ).toBeInTheDocument();
  });

  it('renders the return to home button', () => {
    renderNotFound();
    const button = screen.getByRole('button', { name: /return to home/i });
    expect(button).toBeInTheDocument();
  });

  it('navigates to home when return to home button is clicked', async () => {
    const user = userEvent.setup();
    renderNotFound();

    const button = screen.getByRole('button', { name: /return to home/i });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('has the correct container class', () => {
    const { container } = renderNotFound();
    const containerEl = container.querySelector('.not-found-container');
    expect(containerEl).toBeInTheDocument();
  });

  it('has the correct content class', () => {
    const { container } = renderNotFound();
    const contentEl = container.querySelector('.not-found-content');
    expect(contentEl).toBeInTheDocument();
  });

  it('has the correct button class', () => {
    const { container } = renderNotFound();
    const buttonEl = container.querySelector('.not-found-button');
    expect(buttonEl).toBeInTheDocument();
  });

  it('renders Title component with correct props', () => {
    renderNotFound();
    const title = screen.getByTestId('title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute('data-preset', 'primaryDark');
    expect(title).toHaveAttribute('data-level', '1');
  });

  it('renders Text component with correct props', () => {
    renderNotFound();
    const text = screen.getByTestId('text');
    expect(text).toBeInTheDocument();
    expect(text).toHaveAttribute('data-preset', 'secondaryDark');
  });

  it('renders Button component with correct props', () => {
    renderNotFound();
    const button = screen.getByTestId('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-preset', 'primaryDark');
    expect(button).toHaveClass('not-found-button');
  });

  it('renders Box components with correct structure', () => {
    renderNotFound();
    const boxes = screen.getAllByTestId('box');
    const stackBox = screen.getByTestId('box-stack');

    expect(boxes.length).toBeGreaterThan(0);
    expect(stackBox).toBeInTheDocument();
    expect(stackBox).toHaveAttribute('data-preset', 'stack');
  });
});
