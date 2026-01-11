import { useNavigate } from 'react-router-dom';
import { Title, Text, Box, Button } from '@markfoster314/marduk';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box className="not-found-container">
      <Box preset={['stack']} className="not-found-content">
        <Title preset={['primaryDark']} level={1}>
          404 - Not Found
        </Title>
        <Text preset={['secondaryDark']}>
          The page you're looking for doesn't exist.
        </Text>
        <Button
          onClick={() => {
            // eslint-disable-next-line no-void
            void navigate('/');
          }}
          preset={['primaryDark']}
          className="not-found-button"
        >
          return to home
        </Button>
      </Box>
    </Box>
  );
}
