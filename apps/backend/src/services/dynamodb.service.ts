import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockDocClient } from './dynamodb-mock.service';

const USE_MOCK =
  process.env['MOCK_DYNAMODB'] !== undefined &&
  process.env['MOCK_DYNAMODB'] !== '';

let docClientInstance: typeof DynamoDBDocumentClient.prototype;

if (USE_MOCK) {
  console.log('Using Mock DynamoDB for development');
  // Type assertion needed because mock doesn't implement full interface
  docClientInstance =
    mockDocClient as unknown as typeof DynamoDBDocumentClient.prototype;
} else {
  const dynamoClient = new DynamoDBClient({
    region: process.env['AWS_REGION'] ?? 'us-east-1',
  });
  docClientInstance = DynamoDBDocumentClient.from(dynamoClient);
}

export const docClient = docClientInstance;

export const TABLE_NAME = process.env['DYNAMODB_TABLE_NAME'] ?? 'amala-data';
