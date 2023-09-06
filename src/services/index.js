import { SignUpCommand, CognitoIdentityProviderClient, InitiateAuthCommand, AuthFlowType } from '@aws-sdk/client-cognito-identity-provider'
import { createClientForDefaultRegion } from '../utils/aws-sdk.js'
import { Error } from '../common/type'
import { SRPClient, calculateSignature, getNowString } from 'amazon-user-pool-srp-client'

export const register = async (email, password) => {
  const client = createClientForDefaultRegion(CognitoIdentityProviderClient)
  const command = new SignUpCommand({
    ClientId: process.env.REACT_APP_CLIENT_ID,
    Username: email,
    Password: password
  })
  try {
    await client.send(command)
  } catch (error) {
    return new Error(error.code, error.message)
  }
}

const login = async (email, password) => {
  const client = createClientForDefaultRegion(CognitoIdentityProviderClient)
  const srp = new SRPClient(process.env.REACT_APP_USER_POOL_ID)
  const command = new InitiateAuthCommand({
    ClientId: process.env.REACT_APP_CLIENT_ID,
    AuthFlow: AuthFlowType.USER_SRP_AUTH,
    AuthParameters: {
      USERNAME: email,
      SRP_A: srp.calculateA(),
    }
  })

  try {
    const res = await client.send(command)
    console.log(res)
  } catch (error) {
    return new Error(error.code, error.message)
  }
}

const exports = {
  register,
  login
}
export default exports