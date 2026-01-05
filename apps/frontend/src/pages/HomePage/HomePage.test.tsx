import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Mock the LogoSvg component
vi.mock('@/components/common/LogoSvg/LogoSvg', () => ({
  LogoSvg: ({ animation, size }: { animation: string; size: number }) => (
    <div data-testid="logo-svg" data-animation={animation} data-size={size}>
      Logo
    </div>
  ),
}));

// Mock the Footer component
vi.mock('@/components/layout/Footer/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderHomePage = () => {
    return render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  };

  it('renders without crashing', () => {
    renderHomePage();
    expect(screen.getByText('The Amala Network.')).toBeInTheDocument();
  });

  it('displays the title', () => {
    renderHomePage();
    const title = screen.getByText('The Amala Network.');
    expect(title).toBeInTheDocument();
  });

  it('displays the tagline text', () => {
    renderHomePage();
    expect(screen.getByText('turn on, tune in, drop out')).toBeInTheDocument();
  });

  it('renders the logo component with correct props', () => {
    renderHomePage();
    const logo = screen.getByTestId('logo-svg');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('data-animation', 'heartpulse');
    expect(logo).toHaveAttribute('data-size', '160');
  });

  it('renders the sign in button', () => {
    renderHomePage();
    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).toBeInTheDocument();
  });

  it('renders the Footer component', () => {
    renderHomePage();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('navigates to /auth when sign in button is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const button = screen.getByRole('button', { name: /sign in/i });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });

  it('has the correct container class', () => {
    const { container } = renderHomePage();
    const homeContainer = container.querySelector('.home-container');
    expect(homeContainer).toBeInTheDocument();
  });

  it('has the correct content class', () => {
    const { container } = renderHomePage();
    const homeContent = container.querySelector('.home-content');
    expect(homeContent).toBeInTheDocument();
  });
});
