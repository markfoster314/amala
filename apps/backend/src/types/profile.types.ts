export interface Profile {
  PK: string; // USER#<userId>
  SK: string; // PROFILE
  username: string;
  displayname: string;
  description?: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface ProfileInput {
  username: string;
  displayname: string;
  description?: string;
}

export interface ProfileUpdate {
  username?: string;
  displayname?: string;
  description?: string;
}

export interface ProfileResponse {
  userId: string;
  username: string;
  displayname: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
