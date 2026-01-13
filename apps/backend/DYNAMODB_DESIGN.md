# DynamoDB Single-Table Design

## Table Structure

**Table Name**: `amala-data` (configurable via `DYNAMODB_TABLE_NAME` environment variable)

### Key Schema

- **Partition Key (PK)**: String
- **Sort Key (SK)**: String

Both keys are required for the table structure, allowing for future expansion with relationships.

### Item Types

#### USER#ID Items

Stores user profile information.

**Key Structure:**

- `PK`: `USER#<cognito-sub-uuid>`
- `SK`: `PROFILE`

**Attributes:**

- `username`: string (required)
- `displayname`: string (required)
- `description`: string (optional)
- `createdAt`: timestamp (ISO 8601 string)
- `updatedAt`: timestamp (ISO 8601 string)

**Example Item:**

```json
{
  "PK": "USER#a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "SK": "PROFILE",
  "username": "user@example.com",
  "displayname": "John Doe",
  "description": "Video enthusiast",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### PUBLICVIDEO#ID Items

Stores public video metadata.

**Key Structure:**

- `PK`: `PUBLICVIDEO#<videoId>`
- `SK`: `METADATA`

**Attributes:**

- `title`: string (required)
- `videoUrl`: string (required) - URL to the video
- `thumbnailUrl`: string (required) - S3 URL to thumbnail image
- `userId`: string (required) - Creator's Cognito sub
- `createdAt`: timestamp (ISO 8601 string)
- `updatedAt`: timestamp (ISO 8601 string)

**Example Item:**

```json
{
  "PK": "PUBLICVIDEO#a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "SK": "METADATA",
  "title": "Example Video",
  "videoUrl": "https://www.youtube.com/watch?v=example",
  "thumbnailUrl": "https://bucket.s3.amazonaws.com/thumbnails/abc123.jpg",
  "userId": "user-uuid-here",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### PRIVATEVIDEO#ID Items

Stores private video metadata (only visible to creator).

**Key Structure:**

- `PK`: `PRIVATEVIDEO#<videoId>`
- `SK`: `METADATA`

**Attributes:**

- `title`: string (required)
- `videoUrl`: string (required) - URL to the video
- `thumbnailUrl`: string (required) - S3 URL to thumbnail image
- `userId`: string (required) - Creator's Cognito sub
- `createdAt`: timestamp (ISO 8601 string)
- `updatedAt`: timestamp (ISO 8601 string)

**Example Item:**

```json
{
  "PK": "PRIVATEVIDEO#a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "SK": "METADATA",
  "title": "Private Video",
  "videoUrl": "https://www.youtube.com/watch?v=private",
  "thumbnailUrl": "https://bucket.s3.amazonaws.com/thumbnails/xyz789.jpg",
  "userId": "user-uuid-here",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### PUBLICPLAYLIST#ID Items

Stores public playlist metadata.

**Key Structure:**

- `PK`: `PUBLICPLAYLIST#<playlistId>`
- `SK`: `METADATA`

**Attributes:**

- `title`: string (required)
- `description`: string (optional)
- `thumbnailUrl`: string (required) - S3 URL to thumbnail image
- `userId`: string (required) - Creator's Cognito sub
- `createdAt`: timestamp (ISO 8601 string)
- `updatedAt`: timestamp (ISO 8601 string)

**Example Item:**

```json
{
  "PK": "PUBLICPLAYLIST#a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "SK": "METADATA",
  "title": "Example Playlist",
  "description": "A collection of videos",
  "thumbnailUrl": "https://bucket.s3.amazonaws.com/thumbnails/playlist123.jpg",
  "userId": "user-uuid-here",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### PRIVATEPLAYLIST#ID Items

Stores private playlist metadata (only visible to creator).

**Key Structure:**

- `PK`: `PRIVATEPLAYLIST#<playlistId>`
- `SK`: `METADATA`

**Attributes:**

- `title`: string (required)
- `description`: string (optional)
- `thumbnailUrl`: string (required) - S3 URL to thumbnail image
- `userId`: string (required) - Creator's Cognito sub
- `createdAt`: timestamp (ISO 8601 string)
- `updatedAt`: timestamp (ISO 8601 string)

**Example Item:**

```json
{
  "PK": "PRIVATEPLAYLIST#a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "SK": "METADATA",
  "title": "Private Playlist",
  "description": "My personal collection",
  "thumbnailUrl": "https://bucket.s3.amazonaws.com/thumbnails/private456.jpg",
  "userId": "user-uuid-here",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## Access Patterns

### Current Access Patterns

1. **Get User Profile**: Query by `PK = USER#<userId>` and `SK = PROFILE`
2. **Create/Update User Profile**: PutItem with `PK = USER#<userId>` and `SK = PROFILE`
3. **Check Username Uniqueness**: Query GSI `Username` by `username = <username>` to find existing profiles
4. **Get Public Videos**: Scan with filter `PK begins_with PUBLICVIDEO#` (can optimize with GSI later)
5. **Get Public Playlists**: Scan with filter `PK begins_with PUBLICPLAYLIST#` (can optimize with GSI later)
6. **Get Video by ID**: GetItem with `PK = PUBLICVIDEO#<videoId>` or `PRIVATEVIDEO#<videoId>` and `SK = METADATA`
7. **Get Playlist by ID**: GetItem with `PK = PUBLICPLAYLIST#<playlistId>` or `PRIVATEPLAYLIST#<playlistId>` and `SK = METADATA`

### Global Secondary Indexes (GSI)

#### Username

Used for checking username uniqueness.

- **Partition Key**: `username` (String)
- **Sort Key**: `PK` (String - the USER#userId)
- **Projection**: ALL (projects all attributes)

**Usage**: Query by username to check if it's already taken by another user.

### Future Access Patterns (Planned)

- Query videos by user (GSI: `userId-PK-index`)
- Query public videos (GSI: `type-PK-index`)
- Query videos by date range
- Query videos by tags/categories

## Table Creation

### Using AWS CLI

#### Create Table

```bash
aws dynamodb create-table \
  --table-name amala-data \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=username,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes \
    '[{
      "IndexName": "Username",
      "KeySchema": [
        {"AttributeName": "username", "KeyType": "HASH"},
        {"AttributeName": "PK", "KeyType": "RANGE"}
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }]' \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

#### Add GSI to Existing Table

If you need to add the `Username` GSI to an existing table:

```bash
aws dynamodb update-table \
  --table-name amala-data \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=username,AttributeType=S \
  --global-secondary-index-updates \
    '[{
      "Create": {
        "IndexName": "Username",
        "KeySchema": [
          {"AttributeName": "username", "KeyType": "HASH"},
          {"AttributeName": "PK", "KeyType": "RANGE"}
        ],
        "Projection": {
          "ProjectionType": "ALL"
        },
        "BillingMode": "PAY_PER_REQUEST"
      }
    }]' \
  --region us-east-1
```

**Note**:

- Replace `amala-data` with your actual table name if different
- Replace `us-east-1` with your AWS region
- Adding a GSI to an existing table may take several minutes
- Wait for the index to become `ACTIVE` before using it (check with `aws dynamodb describe-table --table-name amala-data`)

### Using AWS Console

1. Navigate to DynamoDB in AWS Console
2. Click "Create table"
3. Table name: `amala-data`
4. Partition key: `PK` (String)
5. Sort key: `SK` (String)
6. Settings: Use default settings or configure as needed
7. Billing mode: On-demand (Pay per request)
8. Click "Create table"

### Using AWS CDK or Terraform

See infrastructure-as-code examples in `apps/aws/` directory (future implementation).

## Notes

- The `userId` in `USER#<userId>` is the Cognito `sub` claim (UUID)
- All timestamps are stored as ISO 8601 strings
- The table uses on-demand billing for flexible scaling
- The `Username` GSI enables efficient username uniqueness checks
- The single-table design allows for efficient queries and lower costs compared to multiple tables
