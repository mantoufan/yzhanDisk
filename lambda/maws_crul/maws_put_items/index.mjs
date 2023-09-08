import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})

const dynamo = DynamoDBDocumentClient.from(client)

const tableName = 'maws-files'

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    let requestJSON = JSON.parse(event.body)
    await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          id: requestJSON.id,
          input_file_path: requestJSON.input_file_path,
          input_text: requestJSON.input_text,
          output_file_path: null,
          create_timestamp: Date.now(),
          email: requestJSON.email
        },
      })
    )
    body = `Put item ${requestJSON.id}`
  } catch (err) {
    statusCode = 400
    body = err.message
  } finally {
    body = JSON.stringify(body)
  }

  return {
    statusCode,
    body,
    headers,
  }
}
