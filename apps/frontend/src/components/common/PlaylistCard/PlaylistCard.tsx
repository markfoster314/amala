import { Box, Text } from '@markfoster314/marduk';
import './PlaylistCard.css';

export interface PlaylistCardProps {
  playlistUrl: string;
  thumbnails: string[]; // Array of thumbnail images (typically 3)
  title: string;
  videoCount?: number; // Optional video count
  onClick?: () => void;
  className?: string;
}

export default function PlaylistCard({
  playlistUrl: _playlistUrl,
  thumbnails,
  title,
  videoCount,
  onClick,
  className,
}: PlaylistCardProps) {
  // Ensure we have at least 3 thumbnails for the stacked effect
  const displayThumbnails = thumbnails.slice(0, 3);

  return (
    <Box
      className={`playlist-card ${className ?? ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Box className="playlist-card-thumbnail-container">
        <Box className="playlist-card-stacked-thumbnails">
          {displayThumbnails.map((thumbnail, index) => (
            <img
              key={index}
              className="playlist-card-thumbnail"
              src={thumbnail}
              alt={`${title} thumbnail ${index + 1}`}
              style={{ zIndex: displayThumbnails.length - index }}
            />
          ))}
        </Box>
      </Box>
      <Box className="playlist-card-info">
        <Text className="playlist-card-title" preset={['secondaryDark']}>
          {title}
        </Text>
        {videoCount !== undefined && (
          <Text className="playlist-card-count" preset={['muted']}>
            {videoCount} {videoCount === 1 ? 'video' : 'videos'}
          </Text>
        )}
      </Box>
    </Box>
  );
}
