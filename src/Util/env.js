const currentEnv = process.env.REACT_APP_CUSTOM_NODE_ENV || 'development'
const environmentVariables = {
  development: {
    general: {
      base_url: process.env.REACT_APP_BASE_URL_DEV,
    },
    templates: {
      base_url: process.env.REACT_APP_BASE_URL_TEMPLATES_DEV,
    },
    testRunner: {
      base_url: process.env.REACT_APP_BASE_URL_TEST_RUNNER_DEV,
    },
    fileUpload: {
      base_url: process.env.REACT_APP_BASE_URL_FILE_UPLOAD_DEV,
    },
    suiteUpload: {
      base_url: process.env.REACT_APP_BASE_URL_SUITE_UPLOAD_DEV,
    },
    user: {
      base_url: process.env.REACT_APP_BASE_URL_USER_PERSONA_DEV,
    },
    workspace: {
      base_url: process.env.REACT_APP_BASE_URL_WORKSPACE_DEV,
    },
    email: {
      base_url: process.env.REACT_APP_BASE_URL_EMAIL_DEV,
    },
    jira: {
      base_url: process.env.REACT_APP_BASE_URL_JIRA_DEV,
    },
    ai: {
      base_url: process.env.REACT_APP_BASE_URL_AI_DEV,
    },
    report: {
      base_url: process.env.REACT_APP_BASE_URL_REPORT_DEV,
    },
    key: {
      base_url: process.env.REACT_APP_BASE_URL_KEY_DEV,
    },
    stripe: {
      base_url: process.env.REACT_APP_BASE_URL_STRIPE_DEV,
    },
    amplify: {
      aws_project_region: process.env.REACT_APP_AWS_REGION,
      aws_cognito_identity_pool_id:
        process.env.REACT_APP_WS_COGNITO_IDENTITY_POOL_ID_DEV,
      aws_cognito_region: process.env.REACT_APP_AWS_REGION,
      aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID_DEV,
      aws_user_pools_web_client_id:
        process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID_DEV,
      oauth: {},
    },
  },
  stage: {
    general: {
      base_url: process.env.REACT_APP_BASE_URL_STG,
    },
    templates: {
      base_url: process.env.REACT_APP_BASE_URL_TEMPLATES_STG,
    },
    testRunner: {
      base_url: process.env.REACT_APP_BASE_URL_TEST_RUNNER_STG,
    },
    fileUpload: {
      base_url: process.env.REACT_APP_BASE_URL_FILE_UPLOAD_STG,
    },
    suiteUpload: {
      base_url: process.env.REACT_APP_BASE_URL_SUITE_UPLOAD_STG,
    },
    user: {
      base_url: process.env.REACT_APP_BASE_URL_USER_PERSONA_STG,
    },
    workspace: {
      base_url: process.env.REACT_APP_BASE_URL_WORKSPACE_STG,
    },
    email: {
      base_url: process.env.REACT_APP_BASE_URL_EMAIL_STG,
    },
    jira: {
      base_url: process.env.REACT_APP_BASE_URL_JIRA_STG,
    },
    ai: {
      base_url: process.env.REACT_APP_BASE_URL_AI_STG,
    },
    report: {
      base_url: process.env.REACT_APP_BASE_URL_REPORT_STG,
    },
    key: {
      base_url: process.env.REACT_APP_BASE_URL_KEY_STG,
    },
    stripe: {
      base_url: process.env.REACT_APP_BASE_URL_STRIPE_STG,
    },
    amplify: {
      aws_project_region: process.env.REACT_APP_AWS_REGION,
      aws_cognito_identity_pool_id:
        process.env.REACT_APP_WS_COGNITO_IDENTITY_POOL_ID_STG,
      aws_cognito_region: process.env.REACT_APP_AWS_REGION,
      aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID_STG,
      aws_user_pools_web_client_id:
        process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID_STG,
      oauth: {},
    },
  },
  production: {
    general: {
      base_url: process.env.REACT_APP_BASE_URL,
    },
    templates: {
      base_url: process.env.REACT_APP_BASE_URL_TEMPLATES,
    },
    testRunner: {
      base_url: process.env.REACT_APP_BASE_URL_TEST_RUNNER,
    },
    fileUpload: {
      base_url: process.env.REACT_APP_BASE_URL_FILE_UPLOAD,
    },
    suiteUpload: {
      base_url: process.env.REACT_APP_BASE_URL_SUITE_UPLOAD,
    },
    user: {
      base_url: process.env.REACT_APP_BASE_URL_USER_PERSONA,
    },
    workspace: {
      base_url: process.env.REACT_APP_BASE_URL_WORKSPACE,
    },
    email: {
      base_url: process.env.REACT_APP_BASE_URL_EMAIL,
    },
    jira: {
      base_url: process.env.REACT_APP_BASE_URL_JIRA,
    },
    ai: {
      base_url: process.env.REACT_APP_BASE_URL_AI,
    },
    report: {
      base_url: process.env.REACT_APP_BASE_URL_REPORT,
    },
    key: {
      base_url: process.env.REACT_APP_BASE_URL_KEY,
    },
    stripe: {
      base_url: process.env.REACT_APP_BASE_URL_STRIPE,
    },
    amplify: {
      aws_project_region: process.env.REACT_APP_AWS_REGION,
      aws_cognito_identity_pool_id:
        process.env.REACT_APP_WS_COGNITO_IDENTITY_POOL_ID_PROD,
      aws_cognito_region: process.env.REACT_APP_AWS_REGION,
      aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID_PROD,
      aws_user_pools_web_client_id:
        process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID_PROD,
      oauth: {},
    },
  },
}

const currentEnvironmentVariables = { ...environmentVariables[currentEnv] }
export default currentEnvironmentVariables
