import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar/Navbar';
import VideoCard from '@/components/common/VideoCard/VideoCard';
import { Box, Title, Text, LoadingIndicator } from '@markfoster314/marduk';
import { getPlaylist, ApiError, type PlaylistResponse } from '@/lib/api';
import './PlaylistPage.css';

export default function PlaylistPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlaylist() {
      if (!code) {
        setError('Playlist ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const playlistData = await getPlaylist(code);
        setPlaylist(playlistData);
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : 'Failed to load playlist. Please try again.';
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error fetching playlist:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchPlaylist();
  }, [code]);

  // Videos array is empty for now - relationships will be added later
  const videos: Array<{
    videoUrl: string;
    thumbnail: string;
    title: string;
    completionPercentage: number;
    videoId: string;
  }> = [];

  if (isLoading) {
    return (
      <div className="playlist-page-container">
        <Navbar />
        <div className="playlist-page-content">
          <LoadingIndicator darkMode={true} />
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="playlist-page-container">
        <Navbar />
        <div className="playlist-page-content">
          <Box className="playlist-error">
            <Text preset={['secondaryDark']}>
              {error ?? 'Playlist not found'}
            </Text>
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-page-container">
      <Navbar />
      <div className="playlist-page-content">
        {/* Playlist Header */}
        <Box className="playlist-header">
          <img
            src={playlist.thumbnailUrl}
            alt={playlist.title}
            className="playlist-header-image"
          />
          <Box className="playlist-header-info">
            <Title
              preset={['primaryDark']}
              level={1}
              className="playlist-title"
            >
              {playlist.title}
            </Title>
            {playlist.description && (
              <Text preset={['secondaryDark']} className="playlist-description">
                {playlist.description}
              </Text>
            )}
          </Box>
        </Box>

        {/* Video Cards Grid */}
        <Box className="playlist-videos-container">
          {videos.length === 0 ? (
            <Box className="playlist-empty">
              <Text preset={['secondaryDark']}>
                This playlist is empty. Videos can be added later.
              </Text>
            </Box>
          ) : (
            <div className="playlist-videos-grid">
              {videos.map((video) => (
                <VideoCard
                  key={video.videoId}
                  videoUrl={video.videoUrl}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  completionPercentage={video.completionPercentage}
                  onClick={() => {
                    void navigate(`/video/${video.videoId}`);
                  }}
                />
              ))}
            </div>
          )}
        </Box>
      </div>
    </div>
  );
}
