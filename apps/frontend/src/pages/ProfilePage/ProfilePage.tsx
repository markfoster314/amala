import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar/Navbar';
import { Box, Text, Title, Button, TextInput } from '@markfoster314/marduk';
import './ProfilePage.css';

export default function ProfilePage() {
  const { code } = useParams<{ code: string }>();

  // eslint-disable-next-line no-console
  console.log(code);

  // Placeholder data - will be fetched from API later
  const [username, setUsername] = useState('johndoe');
  const [displayName, setDisplayName] = useState('John Doe');
  const [description, setDescription] = useState(
    'This is my profile description. I love sharing videos with my friends!'
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  const [editDisplayName, setEditDisplayName] = useState(displayName);
  const [editDescription, setEditDescription] = useState(description);

  const handleEdit = () => {
    setEditUsername(username);
    setEditDisplayName(displayName);
    setEditDescription(description);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUsername(editUsername);
    setDisplayName(editDisplayName);
    setDescription(editDescription);
    setIsEditing(false);
    // TODO: Save to API
  };

  const handleCancel = () => {
    setEditUsername(username);
    setEditDisplayName(displayName);
    setEditDescription(description);
    setIsEditing(false);
  };

  return (
    <div className="profile-page-container">
      <Navbar showSearch={false} />
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
                  onClick={handleSave}
                  className="profile-save-button"
                >
                  Save Changes
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
