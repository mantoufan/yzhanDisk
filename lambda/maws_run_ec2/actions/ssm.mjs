import { SSMClient, SendCommandCommand, waitUntilCommandExecuted, GetCommandInvocationCommand } from '@aws-sdk/client-ssm'
import { REGION } from '../common/config.mjs'
const client = new SSMClient({ region: REGION })

export const sendCommands = async (instanceId, commands) => {
  const sendCommand = new SendCommandCommand({
    DocumentName: 'AWS-RunShellScript',
    InstanceIds: [instanceId],
    Parameters: {
      commands
    }
  });
  const { Command: { CommandId } } = await client.send(sendCommand)
  await waitUntilCommandExecuted(
    { client },
    { 
      InstanceId: instanceId,
      CommandId
    }
  )
  const getCommand = new GetCommandInvocationCommand({
    CommandId,
    InstanceId: instanceId
  })
  const response = await client.send(getCommand)
  if (response.Status === 'Success') {
    return response.StandardOutputContent
  } else if (response.Status === 'Failed') {
    throw Error(response.StandardErrorContent)
  } else {
    throw Error(response.StandardOutputContent)
  }
}