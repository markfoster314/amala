import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar/Navbar';
import {
  Box,
  Text,
  Title,
  Button,
  TextInput,
  LoadingIndicator,
} from '@markfoster314/marduk';
import { getProfile, updateProfile, ApiError } from '@/lib/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const { code } = useParams<{ code: string }>();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      if (!code) {
        setError('User ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const profile = await getProfile(code);

        setUsername(profile.username);
        setDisplayName(profile.displayname);
        setDescription(profile.description ?? '');
        setEditUsername(profile.username);
        setEditDisplayName(profile.displayname);
        setEditDescription(profile.description ?? '');
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : 'Failed to load profile. Please try again.';
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchProfile();
  }, [code]);

  const handleEdit = () => {
    setEditUsername(username);
    setEditDisplayName(displayName);
    setEditDescription(description);
    setIsEditing(true);
    setError(null);
  };

  const handleSave = async () => {
    if (!code) {
      setError('User ID is required');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const profile = await updateProfile(code, {
        username: editUsername,
        displayname: editDisplayName,
        description: editDescription,
      });

      setUsername(profile.username);
      setDisplayName(profile.displayname);
      setDescription(profile.description ?? '');
      setIsEditing(false);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Failed to save profile. Please try again.';
      setError(errorMessage);
      // eslint-disable-next-line no-console
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditUsername(username);
    setEditDisplayName(displayName);
    setEditDescription(description);
    setIsEditing(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="profile-page-container">
        <Navbar />
        <div className="profile-page-content">
          <LoadingIndicator darkMode={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <Navbar />
      <div className="profile-page-content">
        <Box className="profile-header">
          <Title preset={['primaryDark']} level={1} className="profile-title">
            Profile
          </Title>
          {!isEditing && (
            <Button
              preset={['secondaryDark']}
              onClick={handleEdit}
              className="profile-edit-button"
            >
              Edit
            </Button>
          )}
        </Box>

        {error && (
          <Box className="profile-error">
            <Text preset={['secondaryDark']}>{error}</Text>
          </Box>
        )}

        <Box className="profile-fields">
          {isEditing ? (
            <>
              <Box className="profile-field">
                <TextInput
                  label="Username"
                  type="text"
                  id="profile-username"
                  name="username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required={false}
                />
              </Box>
              <Box className="profile-field">
                <TextInput
                  label="Display Name"
                  type="text"
                  id="profile-display-name"
                  name="displayName"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  required={false}
                />
              </Box>
              <Box className="profile-field">
                <TextInput
                  label="Description"
                  type="text"
                  id="profile-description"
                  name="description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required={false}
                />
              </Box>
              <Box className="profile-actions">
                <Button
                  preset={['secondaryDark']}
                  onClick={handleCancel}
                  className="profile-cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  preset={['primaryDark']}
                  onClick={void handleSave}
                  className="profile-save-button"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box className="profile-field">
                <Text
                  preset={['secondaryDark']}
                  className="profile-field-label"
                >
                  Username
                </Text>
                <Text preset={['primaryDark']} className="profile-field-value">
                  {username}
                </Text>
              </Box>
              <Box className="profile-field">
                <Text
                  preset={['secondaryDark']}
                  className="profile-field-label"
                >
                  Display Name
                </Text>
                <Text preset={['primaryDark']} className="profile-field-value">
                  {displayName}
                </Text>
              </Box>
              <Box className="profile-field">
                <Text
                  preset={['secondaryDark']}
                  className="profile-field-label"
                >
                  Description
                </Text>
                <Text preset={['primaryDark']} className="profile-field-value">
                  {description}
                </Text>
              </Box>
            </>
          )}
        </Box>
      </div>
    </div>
  );
}
