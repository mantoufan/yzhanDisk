import { EC2Client } from '@aws-sdk/client-ec2'
import { REGION } from './config.mjs'

const client = new EC2Client({ region: REGION })
export default client