import { TerminateInstancesCommand } from '@aws-sdk/client-ec2'
import client from '../common/client.mjs'

const terminate = async(instanceId) => {
  const command = new TerminateInstancesCommand({
    InstanceIds: [instanceId],
  })

  try {
    const { TerminatingInstances } = await client.send(command)
    return TerminatingInstances.map(instance => instance.InstanceId)
  } catch (err) {
    console.error(err)
  }
}

export default terminate