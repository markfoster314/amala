import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextInput, Button } from '@markfoster314/marduk';
import { LogoSvg } from '@/components/common/LogoSvg/LogoSvg';
import { useAuth } from '@/contexts/AuthContext';
import './Navbar.css';

interface NavbarProps {
  showSearch?: boolean;
}

export default function Navbar({ showSearch = true }: NavbarProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();

      void navigate('/');
    } catch (_err) {
      // Error handling is done in auth context
    }
  };

  const getProfilePath = () => {
    if (user) {
      // Use username (email) as the profile code
      // Encode it to handle special characters in email
      const username = user.getUsername();
      return `/profile/${encodeURIComponent(username)}`;
    }
    return '/profile';
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      void navigate('/dashboard');
    } else {
      void navigate('/');
    }
  };

  return (
    <Box className="navbar-container">
      <Box className="navbar-content">
        {/* Logo on the left */}
        <Box className="navbar-logo">
          <button
            type="button"
            onClick={handleLogoClick}
            className="navbar-logo-button"
            aria-label="Navigate to home"
          >
            <LogoSvg size={40} animation="none" />
          </button>
        </Box>

        {/* Search input in the middle */}
        {showSearch && (
          <Box className="navbar-search">
            <TextInput
              type="text"
              id="navbar-search"
              name="navbar-search"
              placeholder="Search..."
              required={false}
            />
          </Box>
        )}

        {/* Navigation links on the right */}
        <Box className="navbar-links">
          {isAuthenticated ? (
            <>
              <Button
                preset={['secondaryDark']}
                appearance="text"
                onClick={() => {
                  void navigate('/dashboard');
                }}
                className="navbar-link"
              >
                Dashboard
              </Button>
              <Button
                preset={['secondaryDark']}
                appearance="text"
                onClick={() => {
                  void navigate(getProfilePath());
                }}
                className="navbar-link"
              >
                Profile
              </Button>
              <Button
                preset={['secondaryDark']}
                appearance="text"
                onClick={() => {
                  void handleLogout();
                }}
                className="navbar-link"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              preset={['secondaryDark']}
              appearance="text"
              onClick={() => {
                void navigate('/auth');
              }}
              className="navbar-link"
            >
              Sign In
            </Button>
          )}
        </Box>

        {/* Hamburger menu button (mobile only) */}
        <button
          type="button"
          className="navbar-hamburger"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </Box>

      {/* Mobile menu dropdown - always rendered, controlled by CSS */}
      <Box
        className={`navbar-mobile-menu ${
          isMenuOpen ? 'navbar-mobile-menu-open' : ''
        }`}
      >
        {isAuthenticated ? (
          <>
            <Button
              preset={['secondaryDark']}
              appearance="text"
              onClick={() => {
                void navigate('/dashboard');
                setIsMenuOpen(false);
              }}
              className="navbar-mobile-link"
            >
              Dashboard
            </Button>
            <Button
              preset={['secondaryDark']}
              appearance="text"
              onClick={() => {
                void navigate(getProfilePath());
                setIsMenuOpen(false);
              }}
              className="navbar-mobile-link"
            >
              Profile
            </Button>
            <Button
              preset={['secondaryDark']}
              appearance="text"
              onClick={() => {
                void handleLogout();
                setIsMenuOpen(false);
              }}
              className="navbar-mobile-link"
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            preset={['secondaryDark']}
            appearance="text"
            onClick={() => {
              void navigate('/auth');
              setIsMenuOpen(false);
            }}
            className="navbar-mobile-link"
          >
            Sign In
          </Button>
        )}
      </Box>
    </Box>
  );
}
