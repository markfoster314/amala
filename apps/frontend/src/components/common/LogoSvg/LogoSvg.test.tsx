import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LogoSvg } from './LogoSvg';

// Mock the Svg component from marduk
vi.mock('@markfoster314/marduk', () => ({
  Svg: ({
    viewBox,
    className,
    animation,
    size,
    align,
    responsive,
    children,
    ...props
  }: {
    viewBox?: string;
    className?: string;
    animation?: string;
    size?: number;
    align?: string;
    responsive?: boolean;
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <svg
      data-testid="marduk-svg"
      data-viewbox={viewBox}
      data-classname={className}
      data-animation={animation}
      data-size={size}
      data-align={align}
      data-responsive={responsive}
      {...props}
    >
      {children}
    </svg>
  ),
}));

describe('LogoSvg', () => {
  it('renders without crashing', () => {
    render(<LogoSvg />);
    expect(screen.getByTestId('marduk-svg')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<LogoSvg />);
    const svg = screen.getByTestId('marduk-svg');
    expect(svg).toHaveAttribute('data-viewbox', '0 0 127.5 127.5');
    expect(svg).toHaveAttribute('data-size', '160');
    expect(svg).toHaveAttribute('data-align', 'center');
    expect(svg).toHaveAttribute('data-responsive', 'true');
  });

  it('applies custom size prop', () => {
    render(<LogoSvg size={200} />);
    const svg = screen.getByTestId('marduk-svg');
    expect(svg).toHaveAttribute('data-size', '200');
  });

  it('applies custom align prop', () => {
    render(<LogoSvg align="left" />);
    const svg = screen.getByTestId('marduk-svg');
    expect(svg).toHaveAttribute('data-align', 'left');
  });

  it('applies center align prop', () => {
    render(<LogoSvg align="center" />);
    const svg = screen.getByTestId('marduk-svg');
    expect(svg).toHaveAttribute('data-align', 'center');
  });

  it('applies right align prop', () => {
    render(<LogoSvg align="right" />);
    const svg = screen.getByTestId('marduk-svg');
    expect(svg).toHaveAttribute('data-align', 'right');
  });

  it('applies custom className prop', () => {
    render(<LogoSvg className="custom-class" />);
    const svg = screen.getByTestId('marduk-svg');
    expect(svg).toHaveAttribute('data-classname', 'custom-class');
  });

  it('applies animation prop', () => {
    render(<LogoSvg animation="heartpulse" />);
    const svg = screen.getByTestId('marduk-svg');
    expect(svg).toHaveAttribute('data-animation', 'heartpulse');
  });

  it('does not apply animation prop when not provided', () => {
    render(<LogoSvg />);
    const svg = screen.getByTestId('marduk-svg');
    // When animation is not provided, the attribute should not be set or be undefined
    const animationAttr = svg.getAttribute('data-animation');
    expect(
      animationAttr === null ||
        animationAttr === undefined ||
        animationAttr === ''
    ).toBe(true);
  });

  it('passes through additional props', () => {
    render(<LogoSvg data-custom="test-value" />);
    const svg = screen.getByTestId('marduk-svg');
    expect(svg).toHaveAttribute('data-custom', 'test-value');
  });

  it('renders with all custom props', () => {
    render(
      <LogoSvg
        size={100}
        align="right"
        className="my-logo"
        animation="heartpulse"
        data-test="custom"
      />
    );
    const svg = screen.getByTestId('marduk-svg');
    expect(svg).toHaveAttribute('data-size', '100');
    expect(svg).toHaveAttribute('data-align', 'right');
    expect(svg).toHaveAttribute('data-classname', 'my-logo');
    expect(svg).toHaveAttribute('data-animation', 'heartpulse');
    expect(svg).toHaveAttribute('data-test', 'custom');
  });

  it('always sets responsive to true', () => {
    render(<LogoSvg />);
    const svg = screen.getByTestId('marduk-svg');
    expect(svg).toHaveAttribute('data-responsive', 'true');
  });
});
