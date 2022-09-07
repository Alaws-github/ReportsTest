import { Card, Row, Col, Button, Tooltip, Typography } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SaveOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import Editor from '../Common/Editor'
import React, { useState, useEffect } from 'react'
import CreateBugModal from './Modal/CreateBugModal'
import createJiraIssue from '../../Util/Templates/createJiraIssue'
import { statusColors } from '../../constants'
import PreviewDefectModal from './Modal/PreviewDefectModal'

const { Title, Text, Link } = Typography

function TestCaseControl({
  handleComment,
  update,
  selectedTestCase,
  testRunTitle,
  workspace,
  projectKey,
}) {
  const [comment, setComment] = useState('')
  const [jiraIntegrated, setJiraIntegrated] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [isDefectModalVisible, setDefectModalVisible] = useState(false)
  const [issue, setIssue] = useState('')
  useEffect(() => {
    const serverComment = selectedTestCase?.testCase?.comment?.[0]?.body
    if (serverComment) {
      setComment(serverComment)
    } else {
      setComment('')
    }
    setIssue(
      createJiraIssue({
        projectKey,
        ...selectedTestCase?.testCase,
        testRunTitle,
        testRunLink: window.location.href,
      })
    )
  }, [selectedTestCase])

  useEffect(() => {
    if (workspace?.user?.integrations?.length > 0) {
      setJiraIntegrated(true)
    }
  }, [workspace])

  const SecondaryStatusChangeButton = ({ status, color }) => {
    const isDisabled =
      selectedTestCase?.testCase?.status === status.toLowerCase()
    return (
      <Button
        disabled={isDisabled}
        onClick={() => {
          update(status.toLowerCase())
        }}
        size="large"
        style={{
          borderColor: color,
          color: color,
          width: '100%',
          opacity: isDisabled ? 0.3 : 1,
        }}
        ghost
      >
        {status}
      </Button>
    )
  }

  const PrimaryStatusChangeButton = ({ status, color, ...rest }) => {
    const isDisabled =
      selectedTestCase?.testCase?.status === status.toLowerCase()
    return (
      <Button
        {...rest}
        disabled={isDisabled}
        onClick={() => {
          update(status.toLowerCase())
        }}
        size="large"
        style={{
          borderColor: color,
          color: 'white',
          backgroundColor: color,
          width: '100%',
          opacity: isDisabled ? 0.3 : 1,
        }}
      >
        {status}
      </Button>
    )
  }

  const renderDefectSection = () => {
    // check if defectURL is present
    if (selectedTestCase?.testCase?.defectUrl) {
      // return buttons
      return (
        <>
          <Title
            style={{
              position: 'relative',
              marginBottom: 10,
              marginTop: 20,
            }}
            level={5}
          >
            Defect
          </Title>
          <Row align="middle">
            <Link href={selectedTestCase?.testCase?.defectUrl} target="_blank">
              <Button
                danger
                type="ghost"
                style={{
                  marginRight: 15,
                  background: '#fff1f0',
                  color: '#cf1322',
                  borderColor: '#ffa39e',
                }}
              >
                {selectedTestCase?.testCase?.defectKey}
              </Button>
            </Link>
            {workspace?.user?.integrations?.[0] && (
              <Text underline>
                <Link onClick={() => setDefectModalVisible(true)}>
                  View defect details
                </Link>
              </Text>
            )}
          </Row>
        </>
      )
    }

    if (!projectKey) {
      return null
    }

    return (
      <>
        <Title
          style={{
            position: 'relative',
            marginBottom: 10,
            marginTop: 20,
          }}
          level={5}
        >
          Create a bug ticket in Jira
        </Title>
        {!jiraIntegrated ? (
          <Text>
            Test case failed.{' '}
            <Link href="#user-jira-integration" className="animate-pulse">
              Integrate Jira
            </Link>{' '}
            to create defect ticket
          </Text>
        ) : (
          <Button onClick={() => setModalVisible(true)} type="primary">
            Create Defect Ticket
          </Button>
        )}
      </>
    )
  }

  return (
    <div>
      <Card
        style={{
          border: 0,
          borderLeft: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        <div
          style={{
            height: 'calc(100vh - 22.6em)',
          }}
        >
          <Row
            gutter={[16]}
            justify="space-around"
            style={{ marginBottom: 20 }}
          >
            <Col md={12}>
              <PrimaryStatusChangeButton
                status="Passed"
                icon={<CheckCircleOutlined />}
                color={statusColors.passed}
              />
            </Col>
            <Col md={12}>
              <PrimaryStatusChangeButton
                status="Failed"
                icon={<CloseCircleOutlined />}
                color={statusColors.failed}
              />
            </Col>
          </Row>
          <Row gutter={8} justify="space-around">
            <Col md={8}>
              <SecondaryStatusChangeButton
                status="Blocked"
                color={statusColors.blocked}
              />
            </Col>
            <Col md={8}>
              <SecondaryStatusChangeButton
                status="Skipped"
                color={statusColors.skipped}
              />
            </Col>
            <Col md={8}>
              <SecondaryStatusChangeButton
                status="Not Executed"
                color={statusColors.not_executed}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Row
              style={{ width: '100%', marginBottom: 2 }}
              justify="space-between"
            >
              <Col span={4}>Comment: </Col>
              <Col span={1}>
                <Tooltip
                  placement="bottom"
                  title="Test cases marked as failed should be accompanied by a comment to explain the issue"
                  color="red"
                >
                  {selectedTestCase?.testCase?.status === 'failed' &&
                  !comment ? (
                    <InfoCircleOutlined style={{ color: 'red' }} />
                  ) : null}
                </Tooltip>
              </Col>
              <Col span={19}>
                <Row justify="end">
                  <Button
                    size="small"
                    disabled={comment === ''}
                    type="primary"
                    ghost
                    icon={<SaveOutlined />}
                    onClick={() => {
                      const serverComment =
                        selectedTestCase?.testCase?.comment?.[0]
                      let data = {
                        testRunId: selectedTestCase.testCase.testRunId,
                        id: serverComment?.id || undefined,
                        body: comment,
                      }
                      if (serverComment?.body) {
                        handleComment(data, 'update')
                      } else {
                        handleComment(data, 'create')
                      }
                    }}
                  >
                    Save
                  </Button>
                </Row>
              </Col>
            </Row>
            <div
              style={{
                width: '100%',
                height: '100%',
                overflowY: 'scroll',
                overflowX: 'hidden',
              }}
            >
              <Editor
                key="3"
                value={
                  selectedTestCase?.testCase?.comment?.[0]?.body || comment
                }
                height="calc(100vh - 45em)"
                getDataFromEditor={(data) => {
                  setComment(data)
                }}
              />
            </div>

            {(selectedTestCase?.testCase?.status === 'failed' ||
              selectedTestCase?.testCase?.defectKey) && (
              <div>{renderDefectSection()}</div>
            )}
          </Row>
        </div>
      </Card>
      <CreateBugModal
        testCase={selectedTestCase?.testCase}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        testRunTitle={testRunTitle}
        issue={JSON.stringify(issue)}
      />
      <PreviewDefectModal
        isModalVisible={isDefectModalVisible}
        setModalVisible={setDefectModalVisible}
        defectKey={selectedTestCase?.testCase?.defectKey}
      />
    </div>
  )
}

export default TestCaseControl
