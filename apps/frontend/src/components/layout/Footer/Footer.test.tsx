import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByText(/made with/i)).toBeInTheDocument();
  });

  it('displays the "Made with" text', () => {
    render(<Footer />);
    expect(screen.getByText(/made with/i)).toBeInTheDocument();
  });

  it('renders the Marduk Components link', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /marduk components/i });
    expect(link).toBeInTheDocument();
  });

  it('link has correct href', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /marduk components/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/markfoster314/marduk'
    );
  });

  it('link opens in new tab with security attributes', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /marduk components/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has the correct CSS class', () => {
    const { container } = render(<Footer />);
    const footerBox = container.querySelector('.footer-amala');
    expect(footerBox).toBeInTheDocument();
  });

  it('renders text content correctly', () => {
    render(<Footer />);
    expect(screen.getByText(/made with/i)).toBeInTheDocument();
    expect(screen.getByText(/marduk components/i)).toBeInTheDocument();
  });
});
