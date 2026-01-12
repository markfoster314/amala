import { Box, Text } from '@markfoster314/marduk';
import './VideoCard.css';

export interface VideoCardProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  completionPercentage: number;
  onClick?: () => void;
  className?: string;
}

export default function VideoCard({
  videoUrl: _videoUrl,
  thumbnail,
  title,
  completionPercentage,
  onClick,
  className,
}: VideoCardProps) {
  // Ensure completion percentage is between 0 and 100
  const normalizedPercentage = Math.max(0, Math.min(100, completionPercentage));

  return (
    <Box
      className={`video-card ${className ?? ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Box className="video-card-thumbnail-container">
        <img className="video-card-thumbnail" src={thumbnail} alt={title} />
        <Box className="video-card-progress-overlay">
          <Box
            className="video-card-progress-bar"
            style={{ width: `${normalizedPercentage}%` }}
          />
        </Box>
      </Box>
      <Text className="video-card-title" preset={['secondaryDark']}>
        {title}
      </Text>
    </Box>
  );
}
