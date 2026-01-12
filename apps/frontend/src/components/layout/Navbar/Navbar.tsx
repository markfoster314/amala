import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextInput, Button } from '@markfoster314/marduk';
import { LogoSvg } from '@/components/common/LogoSvg/LogoSvg';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Box className="navbar-container">
      <Box className="navbar-content">
        {/* Logo on the left */}
        <Box className="navbar-logo">
          <button
            type="button"
            onClick={() => {
              // eslint-disable-next-line no-void
              void navigate('/dashboard');
            }}
            className="navbar-logo-button"
            aria-label="Navigate to dashboard"
          >
            <LogoSvg size={40} animation="none" />
          </button>
        </Box>

        {/* Search input in the middle */}
        <Box className="navbar-search">
          <TextInput
            type="text"
            id="navbar-search"
            name="navbar-search"
            placeholder="Search..."
            required={false}
          />
        </Box>

        {/* Navigation links on the right */}
        <Box className="navbar-links">
          <Button
            preset={['secondaryDark']}
            appearance="text"
            onClick={() => {
              // eslint-disable-next-line no-void
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
              // eslint-disable-next-line no-void
              void navigate('/profile/1');
            }}
            className="navbar-link"
          >
            Profile
          </Button>
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
        <Button
          preset={['secondaryDark']}
          appearance="text"
          onClick={() => {
            // eslint-disable-next-line no-void
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
            // eslint-disable-next-line no-void
            void navigate('/profile');
            setIsMenuOpen(false);
          }}
          className="navbar-mobile-link"
        >
          Profile
        </Button>
      </Box>
    </Box>
  );
}
