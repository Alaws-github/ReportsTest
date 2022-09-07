// Load the AWS SDK
import AWS from 'aws-sdk'
const region = 'us-east-1'
const secretName = 'ENV/ALL/MAILSLURP/'

// Create a Secrets Manager client
const client = new AWS.SecretsManager({
  region: region,
})

/**
 * fetches the credentials needed by mailSlurp
 * @returns Promise<Object>
 */
export const getMailSlurpSecretValue = async () => {
  return new Promise((resolve, reject) => {
    let secret
    let decodedBinarySecret
    client.getSecretValue({ SecretId: secretName }, function (err, data) {
      console.log(err)
      if (err) {

        if (err.code === 'DecryptionFailureException') {
          // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
          // Deal with the exception here, and/or rethrow at your discretion.
          reject(err)
        }
        else if (err.code === 'InternalServiceErrorException') {
          // An error occurred on the server side.
          // Deal with the exception here, and/or rethrow at your discretion.
          reject(err)
        }
        else if (err.code === 'InvalidParameterException') {
          // You provided an invalid value for a parameter.
          // Deal with the exception here, and/or rethrow at your discretion.
          reject(err)
        }
        else if (err.code === 'InvalidRequestException') {
          // You provided a parameter value that is not valid for the current state of the resource.
          // Deal with the exception here, and/or rethrow at your discretion.
          reject(err)
        }
        else if (err.code === 'ResourceNotFoundException') {

          // We can't find the resource that you asked for.
          // Deal with the exception here, and/or rethrow at your discretion.
          reject(err)
        }
      } else {
        // Decrypts secret using the associated KMS key.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
          secret = JSON.parse(data.SecretString)
          resolve(secret)
        } else {
          const buff = Buffer.from(data.SecretBinary as string, 'base64')
          decodedBinarySecret = buff.toString('ascii')
          resolve(decodedBinarySecret)
        }
      }
    })
  })
}
