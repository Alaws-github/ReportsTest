import React, { useState } from 'react'
import { Button, Row, Alert, Typography } from 'antd'
import CreateAPIKey from './Modal/CreateAPIKey'
import { createAPIKey, useGetAPIKeysByUser } from '../../../Util/API/Key'
import APIKeyList from './APIKeyList'
const { Paragraph, Text } = Typography
const APIKey = ({ workspace, apiKey, setApiKey }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: apiKeys, isLoading: keysLoading } = useGetAPIKeysByUser()
  return (
    <>
      {apiKey ? (
        <Alert
          closable
          message={`Make sure you copy your API key now. You won't be able to see it again!`}
          description={
            <Paragraph
              style={{
                fontSize: '1.2em',
              }}
              copyable
            >{`${apiKey?.api_key}`}</Paragraph>
          }
          type="success"
          style={{ marginBottom: '10px' }}
          onClose={() => setApiKey(null)}
        />
      ) : (
        <Row align="middle" justify="space-between">
          <Text>Find all your API keys here</Text>
          <Button type="primary" onClick={() => setIsVisible(true)}>
            Create API Key
          </Button>
        </Row>
      )}
      <div
        style={{
          maxHeight: 300,
          overflow: 'auto',
        }}
      >
        <APIKeyList apiKeys={apiKeys} isLoading={keysLoading} />
      </div>
      <CreateAPIKey
        isVisible={isVisible}
        onCancel={() => setIsVisible(false)}
        loading={isLoading}
        onCreateAPIKey={(data) => {
          setIsLoading(true)
          createAPIKey({
            api_key_name: data?.name,
          })
            .then((response) => {
              setIsLoading(false)
              setIsVisible(false)
              setApiKey(response)
              setTimeout(() => {
                setApiKey(null)
              }, 300000)
            })
            .catch((error) => {
              console.log({ error })
              setIsLoading(false)
            })
        }}
      />
    </>
  )
}

export default APIKey
