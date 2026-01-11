import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the LogoSvg component
vi.mock('@/components/common/LogoSvg/LogoSvg', () => ({
  LogoSvg: ({ animation, size }: { animation: string; size: number }) => (
    <div data-testid="logo-svg" data-animation={animation} data-size={size}>
      Logo
    </div>
  ),
}));

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
  TextInput: ({
    id,
    name,
    placeholder,
    required,
  }: {
    id?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
  }) => (
    <input
      data-testid="text-input"
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
      type="text"
    />
  ),
  Button: ({
    onClick,
    preset,
    appearance,
    className,
    children,
  }: {
    onClick?: () => void;
    preset?: string[];
    appearance?: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <button
      data-testid="button"
      onClick={onClick}
      className={className}
      data-preset={preset?.join(',')}
      data-appearance={appearance}
    >
      {children}
    </button>
  ),
}));

describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderNavbar = () => {
    return render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  };

  it('renders without crashing', () => {
    renderNavbar();
    expect(screen.getByTestId('logo-svg')).toBeInTheDocument();
  });

  it('renders the navbar container', () => {
    const { container } = renderNavbar();
    const navbarContainer = container.querySelector('.navbar-container');
    expect(navbarContainer).toBeInTheDocument();
  });

  it('renders the navbar content', () => {
    const { container } = renderNavbar();
    const navbarContent = container.querySelector('.navbar-content');
    expect(navbarContent).toBeInTheDocument();
  });

  describe('Logo', () => {
    it('renders the logo component', () => {
      renderNavbar();
      const logo = screen.getByTestId('logo-svg');
      expect(logo).toBeInTheDocument();
    });

    it('renders logo with correct props', () => {
      renderNavbar();
      const logo = screen.getByTestId('logo-svg');
      expect(logo).toHaveAttribute('data-animation', 'none');
      expect(logo).toHaveAttribute('data-size', '40');
    });

    it('renders logo button with correct class', () => {
      const { container } = renderNavbar();
      const logoButton = container.querySelector('.navbar-logo-button');
      expect(logoButton).toBeInTheDocument();
    });

    it('has correct aria-label on logo button', () => {
      renderNavbar();
      const logoButton = screen.getByLabelText('Navigate to dashboard');
      expect(logoButton).toBeInTheDocument();
    });

    it('navigates to dashboard when logo is clicked', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const logoButton = screen.getByLabelText('Navigate to dashboard');
      await user.click(logoButton);

      expect(mockNavigate).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Search Input', () => {
    it('renders the search input', () => {
      renderNavbar();
      const searchInput = screen.getByTestId('text-input');
      expect(searchInput).toBeInTheDocument();
    });

    it('has correct placeholder text', () => {
      renderNavbar();
      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toBeInTheDocument();
    });

    it('has correct id and name attributes', () => {
      renderNavbar();
      const searchInput = screen.getByTestId('text-input');
      expect(searchInput).toHaveAttribute('id', 'navbar-search');
      expect(searchInput).toHaveAttribute('name', 'navbar-search');
    });

    it('is not required', () => {
      renderNavbar();
      const searchInput = screen.getByTestId('text-input');
      expect(searchInput).not.toHaveAttribute('required');
    });

    it('renders search container with correct class', () => {
      const { container } = renderNavbar();
      const searchContainer = container.querySelector('.navbar-search');
      expect(searchContainer).toBeInTheDocument();
    });
  });

  describe('Desktop Navigation Links', () => {
    it('renders desktop navigation links container', () => {
      const { container } = renderNavbar();
      const navLinks = container.querySelector('.navbar-links');
      expect(navLinks).toBeInTheDocument();
    });

    it('renders Dashboard buttons (desktop and mobile)', () => {
      renderNavbar();
      const dashboardButtons = screen.getAllByRole('button', {
        name: /dashboard/i,
      });
      expect(dashboardButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('renders Profile buttons (desktop and mobile)', () => {
      renderNavbar();
      const profileButtons = screen.getAllByRole('button', {
        name: /profile/i,
      });
      expect(profileButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('desktop navigation buttons have correct classes', () => {
      const { container } = renderNavbar();
      const buttons = container.querySelectorAll('.navbar-link');
      expect(buttons.length).toBe(2);
    });

    it('navigates to dashboard when desktop Dashboard button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      const desktopLinks = container.querySelector('.navbar-links');
      const desktopDashboardButton = desktopLinks?.querySelector(
        'button[data-testid="button"]'
      );
      expect(desktopDashboardButton).toBeInTheDocument();
      if (desktopDashboardButton) {
        await user.click(desktopDashboardButton);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      }
    });

    it('navigates to profile when desktop Profile button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      const desktopLinks = container.querySelector('.navbar-links');
      const buttons = desktopLinks?.querySelectorAll('button[data-testid="button"]');
      expect(buttons).toBeDefined();
      if (buttons && buttons.length >= 2) {
        const profileButton = buttons[1]; // Second button is Profile
        await user.click(profileButton);
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
      }
    });
  });

  describe('Hamburger Menu Button', () => {
    it('renders hamburger menu button', () => {
      const { container } = renderNavbar();
      const hamburgerButton = container.querySelector('.navbar-hamburger');
      expect(hamburgerButton).toBeInTheDocument();
    });

    it('has correct aria-label', () => {
      renderNavbar();
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      expect(hamburgerButton).toBeInTheDocument();
    });

    it('has aria-expanded set to false initially', () => {
      renderNavbar();
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('renders three hamburger lines', () => {
      const { container } = renderNavbar();
      const hamburgerLines = container.querySelectorAll('.hamburger-line');
      expect(hamburgerLines).toHaveLength(3);
    });

    it('toggles aria-expanded when hamburger is clicked', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const hamburgerButton = screen.getByLabelText('Toggle menu');
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');

      await user.click(hamburgerButton);
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

      await user.click(hamburgerButton);
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Mobile Menu', () => {
    it('renders mobile menu container', () => {
      const { container } = renderNavbar();
      const mobileMenu = container.querySelector('.navbar-mobile-menu');
      expect(mobileMenu).toBeInTheDocument();
    });

    it('does not have open class initially', () => {
      const { container } = renderNavbar();
      const mobileMenu = container.querySelector('.navbar-mobile-menu');
      expect(mobileMenu).not.toHaveClass('navbar-mobile-menu-open');
    });

    it('adds open class when hamburger is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      const hamburgerButton = screen.getByLabelText('Toggle menu');
      const mobileMenu = container.querySelector('.navbar-mobile-menu');

      expect(mobileMenu).not.toHaveClass('navbar-mobile-menu-open');

      await user.click(hamburgerButton);

      expect(mobileMenu).toHaveClass('navbar-mobile-menu-open');
    });

    it('removes open class when hamburger is clicked again', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      const hamburgerButton = screen.getByLabelText('Toggle menu');
      const mobileMenu = container.querySelector('.navbar-mobile-menu');

      await user.click(hamburgerButton);
      expect(mobileMenu).toHaveClass('navbar-mobile-menu-open');

      await user.click(hamburgerButton);
      expect(mobileMenu).not.toHaveClass('navbar-mobile-menu-open');
    });

    it('renders mobile menu Dashboard button', () => {
      renderNavbar();
      // Mobile menu buttons have the same text, so we need to check by class
      const { container } = renderNavbar();
      const mobileLinks = container.querySelectorAll('.navbar-mobile-link');
      expect(mobileLinks.length).toBeGreaterThanOrEqual(2);
    });

    it('renders mobile menu Profile button', () => {
      renderNavbar();
      const buttons = screen.getAllByRole('button');
      const profileButtons = buttons.filter((button) =>
        button.textContent?.toLowerCase().includes('profile')
      );
      expect(profileButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('navigates to dashboard when mobile Dashboard button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      // Open the mobile menu first
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      await user.click(hamburgerButton);

      // Find and click the mobile Dashboard button
      const mobileMenu = container.querySelector('.navbar-mobile-menu');
      const mobileButtons = mobileMenu?.querySelectorAll(
        'button[data-testid="button"]'
      );
      expect(mobileButtons).toBeDefined();
      expect(mobileButtons?.length).toBeGreaterThanOrEqual(1);
      if (mobileButtons && mobileButtons.length >= 1) {
        const mobileDashboardButton = mobileButtons[0]; // First button is Dashboard
        await user.click(mobileDashboardButton);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      }
    });

    it('navigates to profile when mobile Profile button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      // Open the mobile menu first
      const hamburgerButton = screen.getByLabelText('Toggle menu');
      await user.click(hamburgerButton);

      // Find and click the mobile Profile button
      const mobileMenu = container.querySelector('.navbar-mobile-menu');
      const mobileButtons = mobileMenu?.querySelectorAll(
        'button[data-testid="button"]'
      );
      expect(mobileButtons).toBeDefined();
      expect(mobileButtons?.length).toBeGreaterThanOrEqual(2);
      if (mobileButtons && mobileButtons.length >= 2) {
        const mobileProfileButton = mobileButtons[1]; // Second button is Profile
        await user.click(mobileProfileButton);

        expect(mockNavigate).toHaveBeenCalledWith('/profile');
      }
    });

    it('closes mobile menu when Dashboard button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      const hamburgerButton = screen.getByLabelText('Toggle menu');
      const mobileMenu = container.querySelector('.navbar-mobile-menu');

      // Open menu
      await user.click(hamburgerButton);
      expect(mobileMenu).toHaveClass('navbar-mobile-menu-open');

      // Click mobile Dashboard button
      const mobileButtons = mobileMenu?.querySelectorAll(
        'button[data-testid="button"]'
      );
      if (mobileButtons && mobileButtons.length >= 1) {
        await user.click(mobileButtons[0]);

        // Menu should be closed after navigation
        expect(mobileMenu).not.toHaveClass('navbar-mobile-menu-open');
      }
    });

    it('closes mobile menu when Profile button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      const hamburgerButton = screen.getByLabelText('Toggle menu');
      const mobileMenu = container.querySelector('.navbar-mobile-menu');

      // Open menu
      await user.click(hamburgerButton);
      expect(mobileMenu).toHaveClass('navbar-mobile-menu-open');

      // Click mobile Profile button
      const mobileButtons = mobileMenu?.querySelectorAll(
        'button[data-testid="button"]'
      );
      if (mobileButtons && mobileButtons.length >= 2) {
        await user.click(mobileButtons[1]);

        // Menu should be closed after navigation
        expect(mobileMenu).not.toHaveClass('navbar-mobile-menu-open');
      }
    });

    it('has correct CSS classes for mobile menu links', () => {
      const { container } = renderNavbar();
      const mobileLinks = container.querySelectorAll('.navbar-mobile-link');
      expect(mobileLinks.length).toBe(2);
    });
  });

  describe('CSS Classes', () => {
    it('has navbar-logo class', () => {
      const { container } = renderNavbar();
      const logoContainer = container.querySelector('.navbar-logo');
      expect(logoContainer).toBeInTheDocument();
    });

    it('has navbar-search class', () => {
      const { container } = renderNavbar();
      const searchContainer = container.querySelector('.navbar-search');
      expect(searchContainer).toBeInTheDocument();
    });

    it('has navbar-links class', () => {
      const { container } = renderNavbar();
      const linksContainer = container.querySelector('.navbar-links');
      expect(linksContainer).toBeInTheDocument();
    });
  });
});
