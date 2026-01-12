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

### Future Item Types (Not Implemented Yet)

#### PUBLICVIDEO#ID Items

**Key Structure:**
- `PK`: `PUBLICVIDEO#<videoId>`
- `SK`: `METADATA` (or video-specific identifier)

#### PRIVATEVIDEO#ID Items

**Key Structure:**
- `PK`: `PRIVATEVIDEO#<videoId>`
- `SK`: `METADATA` (or video-specific identifier)

## Access Patterns

### Current Access Patterns

1. **Get User Profile**: Query by `PK = USER#<userId>` and `SK = PROFILE`
2. **Create/Update User Profile**: PutItem with `PK = USER#<userId>` and `SK = PROFILE`

### Future Access Patterns (Planned)

- Query videos by user (GSI: `userId-PK-index`)
- Query public videos (GSI: `type-PK-index`)
- Query videos by date range
- Query videos by tags/categories

## Table Creation

### Using AWS CLI

```bash
aws dynamodb create-table \
  --table-name amala-data \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

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
- Indexes (GSIs) can be added later for additional query patterns
- The single-table design allows for efficient queries and lower costs compared to multiple tables
