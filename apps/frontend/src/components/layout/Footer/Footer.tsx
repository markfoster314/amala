import { Box, Text, Link } from '@markfoster314/marduk';
import './Footer.css';

export function Footer() {
  return (
    <Box className="footer-amala">
      <Text preset={['muted']} align="center">
        Made with{' '}
        <Link
          preset={['muted']}
          href="https://github.com/markfoster314/marduk"
          target="_blank"
          rel="noopener noreferrer"
        >
          Marduk Components
        </Link>
      </Text>
    </Box>
  );
}
