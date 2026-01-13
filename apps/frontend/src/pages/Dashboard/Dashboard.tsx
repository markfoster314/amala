/* eslint-disable no-void */
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar/Navbar';
import VideoCard from '@/components/common/VideoCard/VideoCard';
import PlaylistCard from '@/components/common/PlaylistCard/PlaylistCard';
import { useNavigate } from 'react-router-dom';
import { TextInput, LoadingIndicator, Box, Text } from '@markfoster314/marduk';
import {
  getPublicVideos,
  getPublicPlaylists,
  ApiError,
  type VideoResponse,
  type PlaylistResponse,
} from '@/lib/api';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setIsLoading(true);
        setError(null);

        const [videosData, playlistsData] = await Promise.all([
          getPublicVideos(),
          getPublicPlaylists(),
        ]);

        setVideos(videosData);
        setPlaylists(playlistsData);
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : 'Failed to load content. Please try again.';
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error fetching content:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchContent();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-content">
          <LoadingIndicator darkMode={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-search">
          <TextInput
            type="text"
            id="dashboard-search"
            name="dashboard-search"
            placeholder="Search..."
            required={false}
          />
        </div>

        {error && (
          <Box className="dashboard-error">
            <Text preset={['secondaryDark']}>{error}</Text>
          </Box>
        )}

        <div className="dashboard-grid">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.playlistId}
              playlistUrl={`/playlist/${playlist.playlistId}`}
              thumbnails={[playlist.thumbnailUrl]}
              title={playlist.title}
              onClick={() => {
                void navigate(`/playlist/${playlist.playlistId}`);
              }}
            />
          ))}
          {videos.map((video) => (
            <VideoCard
              key={video.videoId}
              videoUrl={video.videoUrl}
              thumbnail={video.thumbnailUrl}
              title={video.title}
              completionPercentage={0}
              onClick={() => {
                void navigate(`/video/${video.videoId}`);
              }}
            />
          ))}
        </div>

        {!isLoading && videos.length === 0 && playlists.length === 0 && !error && (
          <Box className="dashboard-empty">
            <Text preset={['secondaryDark']}>
              No public videos or playlists available yet.
            </Text>
          </Box>
        )}
      </div>
    </div>
  );
}
