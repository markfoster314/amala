import type {
  GetCommandInput,
  PutCommandInput,
  UpdateCommandInput,
  QueryCommandInput,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// In-memory storage: Map<"PK#SK", Item>
const mockDataStore = new Map<string, Record<string, unknown>>();

// Index for GSI queries (username index): Map<username, PK[]>
const usernameIndex = new Map<string, string[]>();

/**
 * Parse mock data from environment variable or JSON file
 */
function loadMockData(): void {
  const mockDataEnv = process.env['MOCK_DYNAMODB'];
  if (!mockDataEnv) {
    return;
  }

  try {
    let mockData: Array<Record<string, unknown>>;

    // Try parsing as JSON string first
    if (
      mockDataEnv.trim().startsWith('[') ||
      mockDataEnv.trim().startsWith('{')
    ) {
      mockData = JSON.parse(mockDataEnv);
    } else {
      // Treat as file path
      const filePath = resolve(process.cwd(), mockDataEnv);
      const fileContent = readFileSync(filePath, 'utf-8');
      mockData = JSON.parse(fileContent);
    }

    // Ensure it's an array
    if (!Array.isArray(mockData)) {
      mockData = [mockData];
    }

    // Load data into store
    for (const item of mockData) {
      if (item.PK && item.SK) {
        const key = `${item.PK}#${item.SK}`;
        mockDataStore.set(key, { ...item });

        // Index by username if it exists
        if (item.username && typeof item.username === 'string') {
          const username = item.username.trim();
          if (!usernameIndex.has(username)) {
            usernameIndex.set(username, []);
          }
          const pks = usernameIndex.get(username)!;
          if (!pks.includes(item.PK as string)) {
            pks.push(item.PK as string);
          }
        }
      }
    }

    console.log(`Loaded ${mockDataStore.size} items into mock DynamoDB`);
  } catch (error) {
    console.warn('Failed to load mock DynamoDB data:', error);
  }
}

// Load mock data on module initialization
loadMockData();

/**
 * Create a composite key from PK and SK
 */
function createKey(pk: string, sk: string): string {
  return `${pk}#${sk}`;
}

/**
 * Mock GetCommand handler
 */
function handleGetCommand(input: GetCommandInput): {
  Item?: Record<string, unknown>;
} {
  const { Key } = input;
  if (!Key || !Key.PK || !Key.SK) {
    return {};
  }

  const key = createKey(Key.PK as string, Key.SK as string);
  const item = mockDataStore.get(key);

  return {
    Item: item ? { ...item } : undefined,
  };
}

/**
 * Mock PutCommand handler
 */
function handlePutCommand(input: PutCommandInput): void {
  const { Item } = input;
  if (!Item || !Item.PK || !Item.SK) {
    return;
  }

  const key = createKey(Item.PK as string, Item.SK as string);
  const oldItem = mockDataStore.get(key);

  // Remove old username from index if it exists
  if (oldItem?.username && typeof oldItem.username === 'string') {
    const oldUsername = oldItem.username.trim();
    const oldPks = usernameIndex.get(oldUsername);
    if (oldPks) {
      const index = oldPks.indexOf(Item.PK as string);
      if (index > -1) {
        oldPks.splice(index, 1);
      }
      if (oldPks.length === 0) {
        usernameIndex.delete(oldUsername);
      }
    }
  }

  mockDataStore.set(key, { ...Item });

  // Update username index if username exists
  if (Item.username && typeof Item.username === 'string') {
    const username = Item.username.trim();
    if (!usernameIndex.has(username)) {
      usernameIndex.set(username, []);
    }
    const pks = usernameIndex.get(username)!;
    if (!pks.includes(Item.PK as string)) {
      pks.push(Item.PK as string);
    }
  }
}

/**
 * Mock UpdateCommand handler
 */
function handleUpdateCommand(input: UpdateCommandInput): {
  Attributes?: Record<string, unknown>;
} {
  const {
    Key,
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues,
  } = input;

  if (!Key || !Key.PK || !Key.SK) {
    throw new Error('Key is required');
  }

  const key = createKey(Key.PK as string, Key.SK as string);
  const existingItem = mockDataStore.get(key);

  if (!existingItem) {
    throw new Error('Item not found');
  }

  // Parse UpdateExpression (simplified - handles SET expressions)
  if (UpdateExpression && UpdateExpression.startsWith('SET ')) {
    const setExpression = UpdateExpression.replace('SET ', '').trim();
    const updates = setExpression.split(',').map((u) => u.trim());

    for (const update of updates) {
      const [attrName, valueExpr] = update.split('=').map((s) => s.trim());

      if (attrName && valueExpr) {
        // Resolve attribute name (handles #attrName)
        let resolvedAttrName = attrName;
        if (ExpressionAttributeNames && attrName.startsWith('#')) {
          resolvedAttrName = ExpressionAttributeNames[attrName] || attrName;
        }

        // Resolve value (handles :value)
        let value: unknown = valueExpr;
        if (ExpressionAttributeValues && valueExpr.startsWith(':')) {
          value = ExpressionAttributeValues[valueExpr];
        }

        // Handle attribute removal (SET attr = :null)
        if (value === null) {
          delete existingItem[resolvedAttrName];
        } else {
          existingItem[resolvedAttrName] = value;
        }
      }
    }
  }

  mockDataStore.set(key, existingItem);

  // Update username index if username was changed
  if (existingItem.username && typeof existingItem.username === 'string') {
    const username = existingItem.username.trim();
    if (!usernameIndex.has(username)) {
      usernameIndex.set(username, []);
    }
    const pks = usernameIndex.get(username)!;
    if (!pks.includes(Key.PK as string)) {
      pks.push(Key.PK as string);
    }
  }

  return {
    Attributes: ReturnValues === 'ALL_NEW' ? { ...existingItem } : undefined,
  };
}

/**
 * Mock QueryCommand handler
 */
function handleQueryCommand(input: QueryCommandInput): {
  Items?: Array<Record<string, unknown>>;
} {
  const { IndexName, KeyConditionExpression, ExpressionAttributeValues } =
    input;

  // Handle username index query
  if (
    IndexName === 'Username' &&
    KeyConditionExpression?.includes('username')
  ) {
    const usernameValue = ExpressionAttributeValues?.[':username'];
    if (typeof usernameValue === 'string') {
      const username = usernameValue.trim();
      const pks = usernameIndex.get(username) || [];
      const items: Array<Record<string, unknown>> = [];

      for (const pk of pks) {
        // Find all items with this PK (could have multiple SKs)
        for (const [key, item] of mockDataStore.entries()) {
          if (key.startsWith(`${pk}#`)) {
            items.push({ ...item });
          }
        }
      }

      return { Items: items };
    }
  }

  return { Items: [] };
}

/**
 * Mock ScanCommand handler
 */
function handleScanCommand(input: ScanCommandInput): {
  Items?: Array<Record<string, unknown>>;
} {
  const { FilterExpression, ExpressionAttributeValues } = input;

  let items = Array.from(mockDataStore.values());

  // Apply filter if provided
  if (FilterExpression && ExpressionAttributeValues) {
    // Handle begins_with filter
    if (FilterExpression.includes('begins_with')) {
      const prefixMatch = FilterExpression.match(/begins_with\(PK, :(\w+)\)/);
      if (prefixMatch && ExpressionAttributeValues[`:${prefixMatch[1]}`]) {
        const prefix = ExpressionAttributeValues[
          `:${prefixMatch[1]}`
        ] as string;
        items = items.filter((item) => {
          const pk = item.PK as string;
          return pk && pk.startsWith(prefix);
        });
      }
    }
  }

  return {
    Items: items.map((item) => ({ ...item })),
  };
}

/**
 * Mock DynamoDB Document Client that matches AWS SDK interface
 * Commands have an `input` property with the command parameters
 */
export const mockDocClient = {
  send: async (command: {
    input:
      | GetCommandInput
      | PutCommandInput
      | UpdateCommandInput
      | QueryCommandInput
      | ScanCommandInput;
    constructor?: { name?: string };
  }): Promise<unknown> => {
    const input = command.input;
    const commandName = command.constructor?.name || '';

    // Determine command type
    if (
      commandName.includes('Get') ||
      ('Key' in input && !('UpdateExpression' in input) && !('Item' in input))
    ) {
      return handleGetCommand(input as GetCommandInput);
    }

    if (commandName.includes('Put') || 'Item' in input) {
      handlePutCommand(input as PutCommandInput);
      return {};
    }

    if (commandName.includes('Update') || 'UpdateExpression' in input) {
      return handleUpdateCommand(input as UpdateCommandInput);
    }

    if (
      commandName.includes('Query') ||
      'KeyConditionExpression' in input ||
      'IndexName' in input
    ) {
      return handleQueryCommand(input as QueryCommandInput);
    }

    if (commandName.includes('Scan') || 'FilterExpression' in input) {
      return handleScanCommand(input as ScanCommandInput);
    }

    throw new Error(
      `Unsupported command: ${commandName || JSON.stringify(Object.keys(input))}`
    );
  },
};

/**
 * Clear all mock data (useful for testing)
 */
export function clearMockData(): void {
  mockDataStore.clear();
  usernameIndex.clear();
}

/**
 * Get all mock data (useful for debugging)
 */
export function getAllMockData(): Array<Record<string, unknown>> {
  return Array.from(mockDataStore.values());
}
