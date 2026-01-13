export interface Video {
  PK: string; // PUBLICVIDEO#<videoId> or PRIVATEVIDEO#<videoId>
  SK: string; // METADATA
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  userId: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface VideoInput {
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  isPublic: boolean;
}

export interface VideoUpdate {
  title?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  isPublic?: boolean;
}

export interface VideoResponse {
  videoId: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
