import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({
  region: process.env['AWS_REGION'] ?? 'us-east-1',
});

export const docClient = DynamoDBDocumentClient.from(dynamoClient);

export const TABLE_NAME = process.env['DYNAMODB_TABLE_NAME'] ?? 'amala-data';
