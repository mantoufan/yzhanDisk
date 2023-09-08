import { RunInstancesCommand, waitUntilInstanceStatusOk } from '@aws-sdk/client-ec2'
import client from './common/client.mjs'
import commands from './actions/command.mjs'
import { sendCommands } from './actions/ssm.mjs'
import terminate from './actions/terminate.mjs'
import { sendMessage } from './common/socket.mjs'

export const handler = async (event) => {
  const { Records } = event
  const { eventName, dynamodb } = Records[0]
  if (eventName !== 'INSERT') return
  const id = dynamodb.Keys.id.S
  const email = dynamodb.NewImage.email.S
  const command = new RunInstancesCommand({
    ImageId: 'ami-02379310976710422',
    InstanceType: 't2.micro',
    IamInstanceProfile: {
      Arn: 'arn:aws:iam::935515739846:instance-profile/maws-ec2-to-ssm-role'
    },
    MinCount: 1,
    MaxCount: 1,
  })

  try {
    await sendMessage(email, 'S3 Object [' + id +'] Received. EC2 Instance Creating...')
    const response = await client.send(command)
    const instanceId = response.Instances[0].InstanceId
    await sendMessage(email, 'EC2 Instance [' + instanceId + '] created. Initializing...(3 - 5 minutes as usual)')
    await waitUntilInstanceStatusOk(
      { client },
      { InstanceIds: [instanceId] }
    )
    await sendMessage(email, 'EC2 Instance [' + instanceId + '] is Ok. Running scripts...')
    const res = await sendCommands(instanceId, commands(id))
    await sendMessage(email, 'EC2 Instance [' + instanceId + '] work complete. Terminating...')
    await terminate(instanceId)
    await sendMessage(email, 'EC2 Instance [' + instanceId + '] terminated. Updating tables...', 'updateTable')
    await sendMessage(email, 'S3 Object [' + id +'] get OUTPUT_FILE_PATH successfull')
  } catch (err) {
    console.error(err)
  }
}
