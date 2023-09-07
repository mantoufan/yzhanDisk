import { SignUpCommand, CognitoIdentityProviderClient, InitiateAuthCommand, AuthFlowType, RespondToAuthChallengeCommand, GetUserCommand, GlobalSignOutCommand, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { createClientForDefaultRegion } from '../../utils/aws-sdk.js'
import { Error } from '../../common/type.js'
import Srp from 'aws-cognito-srp-client'
import store from '../../utils/store.js'

const srp = new Srp(process.env.REACT_APP_USER_POOL_ID)
const client = createClientForDefaultRegion(CognitoIdentityProviderClient)

export const register = async (email, password) => {
  const command = new SignUpCommand({
    ClientId: process.env.REACT_APP_CLIENT_ID,
    Username: email,
    Password: password
  })
  try {
    await client.send(command)
  } catch (error) {
    throw new Error(error.code, error.message)
  }
}

const login = async (email, password) => {
  const command = new InitiateAuthCommand({
    ClientId: process.env.REACT_APP_CLIENT_ID,
    AuthFlow: AuthFlowType.USER_SRP_AUTH,
    AuthParameters: {
      USERNAME: email,
      SRP_A: srp.getA(),
    }
  })

  try {
    const { ChallengeName, ChallengeParameters} = await client.send(command)
    return getToken(ChallengeName, ChallengeParameters, email, password)
  } catch (error) {
    throw new Error(error.code, error.message)
  }
}

const getToken = async (ChallengeName, ChallengeParameters, username, password) => {
  const { USER_ID_FOR_SRP, SRP_B, SALT, SECRET_BLOCK } = ChallengeParameters
  const { signature, timestamp } = srp.getSignature( USER_ID_FOR_SRP, SRP_B, SALT, SECRET_BLOCK, password)
  
  const command = new RespondToAuthChallengeCommand({
    ClientId: process.env.REACT_APP_CLIENT_ID,
    ChallengeName,
    ChallengeResponses: {
      PASSWORD_CLAIM_SIGNATURE: signature,
      PASSWORD_CLAIM_SECRET_BLOCK: SECRET_BLOCK,
      TIMESTAMP: timestamp,
      USERNAME: username,
    }
  })

  try {
    const { AuthenticationResult } = await client.send(command)
    const { AccessToken, RefreshToken } = AuthenticationResult
    return { AccessToken, RefreshToken }
  } catch (error) {
    throw new Error(error.name, error.message)
  }
}

const getUserEmail = async () => {
  const accessToken = store.get('AccessToken')
  if (accessToken === null) throw new Error('NotAuthorizedException', 'Not logged in')
  const command = new GetUserCommand({
    AccessToken: accessToken
  })
  try {
    const { UserAttributes } = await client.send(command)
    return UserAttributes.find(attribute => attribute.Name === 'email').Value
  } catch (error) {
    throw new Error(error.code, error.message)
  }
}

const logout = async () => {
  const accessToken = store.get('AccessToken') 
  if (accessToken === null) throw new Error('NotAuthorizedException', 'Not logged in')
  const command = new GlobalSignOutCommand({
    AccessToken: accessToken
  })
  try {
    await client.send(command)
    store.remove('AccessToken')
  } catch (error) {
    throw new Error(error.code, error.message)
  }
}

const confirm = async (username, code) => {
  const command = new ConfirmSignUpCommand({
    ClientId: process.env.REACT_APP_CLIENT_ID,
    Username: username,
    ConfirmationCode: code
  })
  try {
    await client.send(command)
  } catch (error) {
    throw new Error(error.code, error.message)
  }
}

const exports = {
  register,
  login,
  getUserEmail,
  logout,
  confirm
}
export default exports