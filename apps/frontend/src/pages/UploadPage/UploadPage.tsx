import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar/Navbar';
import { Box, Text, Title, Button, TextInput } from '@markfoster314/marduk';
import { uploadVideo, uploadPlaylist, ApiError } from '@/lib/api';
import './UploadPage.css';

type ContentType = 'video' | 'playlist';
type Visibility = 'public' | 'private';

export default function UploadPage() {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState<ContentType>('video');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Video form state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null);

  // Playlist form state
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [playlistThumbnail, setPlaylistThumbnail] = useState<File | null>(null);

  const handleVideoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!videoTitle.trim() || !videoUrl.trim()) {
      setError('Title and video URL are required');
      return;
    }

    if (!videoThumbnail) {
      setError('Thumbnail image is required');
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('title', videoTitle.trim());
      formData.append('videoUrl', videoUrl.trim());
      formData.append('isPublic', visibility === 'public' ? 'true' : 'false');
      formData.append('thumbnail', videoThumbnail);

      const video = await uploadVideo(formData);
      void navigate(`/video/${video.videoId}`);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Failed to upload video. Please try again.';
      setError(errorMessage);
      // eslint-disable-next-line no-console
      console.error('Error uploading video:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaylistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!playlistTitle.trim()) {
      setError('Title is required');
      return;
    }

    if (!playlistThumbnail) {
      setError('Thumbnail image is required');
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('title', playlistTitle.trim());
      if (playlistDescription.trim()) {
        formData.append('description', playlistDescription.trim());
      }
      formData.append('isPublic', visibility === 'public' ? 'true' : 'false');
      formData.append('thumbnail', playlistThumbnail);

      const playlist = await uploadPlaylist(formData);
      void navigate(`/playlist/${playlist.playlistId}`);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Failed to upload playlist. Please try again.';
      setError(errorMessage);
      // eslint-disable-next-line no-console
      console.error('Error uploading playlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-page-container">
      <Navbar />
      <div className="upload-page-content">
        <Title preset={['primaryDark']} level={1} className="upload-title">
          Upload Content
        </Title>

        {/* Type Selection */}
        <Box className="upload-type-selection">
          <Button
            preset={
              contentType === 'video' ? ['primaryDark'] : ['secondaryDark']
            }
            onClick={() => setContentType('video')}
            className="upload-type-button"
            disabled={isLoading}
          >
            Video
          </Button>
          <Button
            preset={
              contentType === 'playlist' ? ['primaryDark'] : ['secondaryDark']
            }
            onClick={() => setContentType('playlist')}
            className="upload-type-button"
            disabled={isLoading}
          >
            Playlist
          </Button>
        </Box>

        {/* Visibility Selection */}
        <Box className="upload-visibility-selection">
          <Button
            preset={
              visibility === 'public' ? ['primaryDark'] : ['secondaryDark']
            }
            onClick={() => setVisibility('public')}
            className="upload-visibility-button"
            disabled={isLoading}
          >
            Public
          </Button>
          <Button
            preset={
              visibility === 'private' ? ['primaryDark'] : ['secondaryDark']
            }
            onClick={() => setVisibility('private')}
            className="upload-visibility-button"
            disabled={isLoading}
          >
            Private
          </Button>
        </Box>

        {error && (
          <Box className="upload-error">
            <Text preset={['secondaryDark']}>{error}</Text>
          </Box>
        )}

        {/* Video Form */}
        {contentType === 'video' && (
          <form onSubmit={handleVideoSubmit} className="upload-form">
            <Box className="upload-form-field">
              <TextInput
                label="Title"
                type="text"
                id="video-title"
                name="title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </Box>

            <Box className="upload-form-field">
              <TextInput
                label="Video URL"
                type="url"
                id="video-url"
                name="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                disabled={isLoading}
              />
            </Box>

            <Box className="upload-form-field">
              <Text preset={['secondaryDark']} className="upload-form-label">
                Thumbnail Image
              </Text>
              <input
                type="file"
                id="video-thumbnail"
                name="thumbnail"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setVideoThumbnail(file);
                }}
                required
                disabled={isLoading}
                className="upload-file-input"
              />
            </Box>

            <Button
              type="submit"
              preset={['primaryDark']}
              disabled={isLoading}
              className="upload-submit-button"
            >
              {isLoading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </form>
        )}

        {/* Playlist Form */}
        {contentType === 'playlist' && (
          <form onSubmit={handlePlaylistSubmit} className="upload-form">
            <Box className="upload-form-field">
              <TextInput
                label="Title"
                type="text"
                id="playlist-title"
                name="title"
                value={playlistTitle}
                onChange={(e) => setPlaylistTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </Box>

            <Box className="upload-form-field">
              <Text preset={['secondaryDark']} className="upload-form-label">
                Description
              </Text>
              <textarea
                id="playlist-description"
                name="description"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                rows={4}
                disabled={isLoading}
                className="upload-textarea"
              />
            </Box>

            <Box className="upload-form-field">
              <Text preset={['secondaryDark']} className="upload-form-label">
                Thumbnail Image
              </Text>
              <input
                type="file"
                id="playlist-thumbnail"
                name="thumbnail"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setPlaylistThumbnail(file);
                }}
                required
                disabled={isLoading}
                className="upload-file-input"
              />
            </Box>

            <Button
              type="submit"
              preset={['primaryDark']}
              disabled={isLoading}
              className="upload-submit-button"
            >
              {isLoading ? 'Uploading...' : 'Upload Playlist'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
