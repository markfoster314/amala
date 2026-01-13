export interface Playlist {
  PK: string; // PUBLICPLAYLIST#<playlistId> or PRIVATEPLAYLIST#<playlistId>
  SK: string; // METADATA
  title: string;
  description?: string;
  thumbnailUrl: string;
  userId: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface PlaylistInput {
  title: string;
  description?: string;
  thumbnailUrl: string;
  isPublic: boolean;
}

export interface PlaylistUpdate {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  isPublic?: boolean;
}

export interface PlaylistResponse {
  playlistId: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
