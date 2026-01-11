import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import Navbar from '@/components/layout/Navbar/Navbar';
import { Box, Title } from '@markfoster314/marduk';
import './VideoPage.css';

export default function VideoPage() {
  const { code } = useParams<{ code: string }>();

  // eslint-disable-next-line no-console
  console.log('Video code:', code);

  // For now, using a placeholder video URL - will be replaced with actual video URL from code
  const videoUrl = 'https://www.youtube.com/watch?v=cBkyS0MwGlk';

  // Placeholder title - will be fetched from API later
  const title = 'Video Title';

  return (
    <div className="video-page-container">
      <Navbar />
      <div className="video-page-content">
        <Box className="video-player-container">
          <ReactPlayer
            src={videoUrl}
            controls
            width="100%"
            height="100%"
            className="video-player"
          />
        </Box>
        <Title preset={['primaryDark']} level={1} className="video-title">
          {title}
        </Title>
      </div>
    </div>
  );
}
