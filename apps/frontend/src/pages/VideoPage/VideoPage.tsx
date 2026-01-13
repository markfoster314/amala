import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import Navbar from '@/components/layout/Navbar/Navbar';
import { Box, Title, LoadingIndicator, Text } from '@markfoster314/marduk';
import { getVideo, ApiError, type VideoResponse } from '@/lib/api';
import './VideoPage.css';

export default function VideoPage() {
  const { code } = useParams<{ code: string }>();
  const [video, setVideo] = useState<VideoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      if (!code) {
        setError('Video ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const videoData = await getVideo(code);
        setVideo(videoData);
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : 'Failed to load video. Please try again.';
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error fetching video:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchVideo();
  }, [code]);

  if (isLoading) {
    return (
      <div className="video-page-container">
        <Navbar />
        <div className="video-page-content">
          <LoadingIndicator darkMode={true} />
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="video-page-container">
        <Navbar />
        <div className="video-page-content">
          <Box className="video-error">
            <Text preset={['secondaryDark']}>{error ?? 'Video not found'}</Text>
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="video-page-container">
      <Navbar />
      <div className="video-page-content">
        <Box className="video-player-container">
          <ReactPlayer
            src={video.videoUrl}
            controls={true}
            width="100%"
            height="100%"
            className="video-player"
          />
        </Box>
        <Title preset={['primaryDark']} level={1} className="video-title">
          {video.title}
        </Title>
      </div>
    </div>
  );
}
