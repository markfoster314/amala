import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar/Navbar';
import VideoCard from '@/components/common/VideoCard/VideoCard';
import { Box, Title, Text } from '@markfoster314/marduk';
import thumbnailImage from '../../../../../internals/smt3.jpg';
import './PlaylistPage.css';

export default function PlaylistPage() {
  const { code } = useParams<{ code: string }>();

  // eslint-disable-next-line no-console
  console.log('Playlist code:', code);

  // Placeholder data - will be fetched from API later
  const playlistTitle = 'Example Playlist';
  const playlistDescription =
    'This is an example playlist description. It can contain information about the playlist, its purpose, or any other relevant details.';
  const playlistImage = thumbnailImage;

  // Placeholder video data - will be fetched from API later
  const videos = [
    {
      videoUrl: 'https://www.youtube.com/watch?v=8L8Nh67PbO4',
      thumbnail: thumbnailImage,
      title: 'Video 1',
      completionPercentage: 65,
    },
    {
      videoUrl: 'https://www.youtube.com/watch?v=8L8Nh67PbO4',
      thumbnail: thumbnailImage,
      title: 'Video 2',
      completionPercentage: 30,
    },
    {
      videoUrl: 'https://www.youtube.com/watch?v=8L8Nh67PbO4',
      thumbnail: thumbnailImage,
      title: 'Video 3',
      completionPercentage: 0,
    },
    {
      videoUrl: 'https://www.youtube.com/watch?v=8L8Nh67PbO4',
      thumbnail: thumbnailImage,
      title: 'Video 4',
      completionPercentage: 100,
    },
  ];

  return (
    <div className="playlist-page-container">
      <Navbar />
      <div className="playlist-page-content">
        {/* Playlist Header */}
        <Box className="playlist-header">
          <img
            src={playlistImage}
            alt={playlistTitle}
            className="playlist-header-image"
          />
          <Box className="playlist-header-info">
            <Title
              preset={['primaryDark']}
              level={1}
              className="playlist-title"
            >
              {playlistTitle}
            </Title>
            <Text preset={['secondaryDark']} className="playlist-description">
              {playlistDescription}
            </Text>
          </Box>
        </Box>

        {/* Video Cards Grid */}
        <Box className="playlist-videos-container">
          <div className="playlist-videos-grid">
            {videos.map((video, index) => (
              <VideoCard
                key={index}
                videoUrl={video.videoUrl}
                thumbnail={video.thumbnail}
                title={video.title}
                completionPercentage={video.completionPercentage}
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log('Video clicked:', video.title);
                }}
              />
            ))}
          </div>
        </Box>
      </div>
    </div>
  );
}
