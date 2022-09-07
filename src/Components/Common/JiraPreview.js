import React, { useState, useEffect } from 'react'
import ReactTimeAgo from 'react-time-ago'
import {
  Tag,
  Typography,
  Spin,
  Empty,
  Row,
  Space,
  Avatar,
  Col,
  Divider,
} from 'antd'
import EditorJira from './EditorJira'
import { useGetJiraIssue } from '../../Util/API/Jira'

const { Text, Title } = Typography

const JiraPreview = ({ isVisible, issueId }) => {
  const { data, isLoading } = useGetJiraIssue({ issueId, isVisible })
  const [issue, setIssue] = useState({})

  const Details = ({ fields }) => {
    const extractFirstLetters = function (name) {
      let firstName = name.split(' ')?.[0]
      let lastName = name.split(' ')?.[1]

      let firstLetters = firstName?.[0] + lastName?.[0]

      return firstLetters
    }
    const getColor = (jiraColor) => {
      let color = 'blue'
      color = jiraColor?.includes('-') ? jiraColor?.split('-')[1] : jiraColor
      return color
    }
    const DetailRow = (props) => {
      const { title, children } = props
      return (
        <Row align="middle" {...props}>
          <Col span={12}>
            <div>
              <Text
                style={{
                  fontWeight: 'bold',
                }}
                type="secondary"
              >
                {title}
              </Text>
            </div>
          </Col>
          <Col
            style={{
              paddingBottom: 3,
              paddingTop: 3,
            }}
            span={12}
          >
            {children}
          </Col>
        </Row>
      )
    }

    return (
      <div>
        <DetailRow title="Status:">
          <Tag color={getColor(fields?.status?.statusCategory?.colorName)}>
            {fields?.status?.statusCategory?.name}
          </Tag>
        </DetailRow>
        <DetailRow title="Assignee:">
          <>
            {fields?.assignee ? (
              <>
                {fields?.assignee?.avatarUrls ? (
                  <Space>
                    <Avatar
                      size={25}
                      src={fields?.assignee?.avatarUrls['32x32']}
                    />
                    {fields?.assignee?.displayName}
                  </Space>
                ) : (
                  <Avatar>
                    {extractFirstLetters(fields?.assignee?.displayName)}
                  </Avatar>
                )}
              </>
            ) : (
              'None'
            )}
          </>
        </DetailRow>
        <DetailRow title="Reporter:">
          <>
            {fields?.creator ? (
              <>
                {fields?.creator?.avatarUrls ? (
                  <Space>
                    <Avatar
                      size={25}
                      src={fields?.creator?.avatarUrls['32x32']}
                    />
                    {fields?.creator?.displayName}
                  </Space>
                ) : (
                  <Avatar>
                    {extractFirstLetters(fields?.creator?.displayName)}
                  </Avatar>
                )}
              </>
            ) : (
              'None'
            )}
          </>
        </DetailRow>
        <DetailRow title="Created: ">
          <ReactTimeAgo date={fields?.created} />
        </DetailRow>
      </div>
    )
  }

  useEffect(() => {
    if (data && data?.issue) {
      setIssue(data?.issue)
    } else {
      setIssue(null)
    }

    if (data && !data?.issue && data?.includes('404')) {
      // Issue was not found
      setIssue(null)
    }
  }, [data])

  return (
    <Spin spinning={isLoading}>
      {!isLoading && issue?.fields ? (
        <div>
          {' '}
          <Title level={4}>{issue?.fields?.summary}</Title>
          <Divider orientation="left">Details</Divider>
          <Details fields={issue?.fields} />
          <Divider orientation="left">Description</Divider>
          <EditorJira
            document={issue?.fields?.description}
            getActions={() => {}}
            markdown={false}
          />
        </div>
      ) : (
        <div
          style={{
            height: '400px',
          }}
        >
          <Empty
            style={{ marginTop: '150px' }}
            description={
              isLoading
                ? 'Fetching data...'
                : 'No data to display. Please ensure your reference URL is valid.'
            }
          />
        </div>
      )}
    </Spin>
  )
}

export default JiraPreview
