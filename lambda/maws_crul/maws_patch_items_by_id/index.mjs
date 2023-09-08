import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})

const dynamo = DynamoDBDocumentClient.from(client)

const tableName = 'maws-files'

export const handler = async (event, context) => {
  let requestJSON = JSON.parse(event.body)
  let body
  let statusCode = 200
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    body = await dynamo.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          id: event.pathParameters.id,
        },
        UpdateExpression: "set output_file_path = :output_file_path",
        ExpressionAttributeValues: {
          ':output_file_path': requestJSON.output_file_path
        },
      })
    )
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
