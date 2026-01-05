import { Box, Text, Title, Button } from '@markfoster314/marduk';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { LogoSvg } from '@/components/common/LogoSvg/LogoSvg';
import { Footer } from '@/components/layout/Footer/Footer';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box className="home-container">
      <Box className="home-content">
        <LogoSvg animation="heartpulse" size={160} />
        <Title preset={['primaryDark']} align="center" className="home-title">
          The Amala Network.
        </Title>
        <Text preset={['secondaryDark']} align="center">
          turn on, tune in, drop out
        </Text>
        <Box preset={['center']}>
          <Button
            onClick={() => {
              // eslint-disable-next-line no-void
              void navigate('/auth');
            }}
            preset={['primaryDark']}
            className="home-button"
          >
            sign in
          </Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
