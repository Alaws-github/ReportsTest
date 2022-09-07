import environmentalVariables from './Util/env'
const { amplify } = environmentalVariables

const awsConfig = {
  aws_project_region: amplify.aws_project_region,
  aws_cognito_identity_pool_id: amplify.aws_cognito_identity_pool_id,
  aws_cognito_region: amplify.aws_cognito_region,
  aws_user_pools_id: amplify.aws_user_pools_id,
  aws_user_pools_web_client_id: amplify.aws_user_pools_web_client_id,
  oauth: amplify.oauth,
}

export default awsConfig
