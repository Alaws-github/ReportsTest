import { Button, Col, Result, Row, Card } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLoading from '../Common/PageLoader'
import { useQuery } from '../../Hooks'
import { useAuth } from '../../Context/AuthContext'
import { getJiraAuthLink } from '../../Util/util'
import { useWorkspace } from '../../Context/WorkspaceContext'
import { useJiraMutation } from '../../Util/API/Jira'
import { Notification } from '../Common/Feedback'
import SEO from '../Common/SEO'
import JiraManageProjects from './JiraManageProjects'

function JiraSuccessScreen() {
  const workspace = useWorkspace()
  const [success, setSuccess] = useState(true)
  const [loading, setLoading] = useState(true)
  const [jiraUrl, setJiraUrl] = useState('')
  const [completed, setCompleted] = useState(false)
  const query = useQuery()
  const { currentUser } = useAuth()
  const { integrateWithJira, authenticateUserWithJira } = useJiraMutation()
  const [fired, setFired] = useState(false)

  useEffect(() => {
    if (workspace?.workspaceId && !fired) {
      setFired(true)
      jiraAuthentication()
    }
  }, [workspace])

  useEffect(() => {
    if ('attributes' in currentUser && 'sub' in currentUser?.attributes) {
      const userId = currentUser.attributes.sub
      setJiraUrl(getJiraAuthLink(userId))
    }
  }, [currentUser])

  async function jiraAuthentication() {
    const authCode = query.get('code')
    const state = query.get('state')

    if (currentUser.attributes.sub === state) {
      // check if Admin
      if (workspace?.integrations?.length === 0) {
        try {
          // send auth code to server for for integration
          await integrateWithJira({
            authorization_code: authCode,
            workspace_id: workspace?.workspaceId,
          })
          setLoading(false)
          setSuccess(true)
        } catch (error) {
          console.log(error)
          setSuccess(false)
          setLoading(false)
        }
      } else {
        // authenticate all users with this option is the workspace has no integration
        authenticateUserWithJira({
          authorization_code: authCode,
        })
          .then(() => {
            Notification(
              'success',
              `You have successfully completed the Jira Integration!`
            )
            setLoading(false)
            setSuccess(true)
          })
          .catch((error) => {
            Notification(
              'error',
              'Could not complete the Jira integration. Please try again later!'
            )
            setSuccess(false)
            setLoading(false)
          })
      }
    } else {
      // set notification about wrong user
      Notification(
        'error',
        'Wrong User',
        'The current user did not start the integration. Please try again!'
      )
      setSuccess(false)
      setLoading(false)
    }
  }

  const renderResult = () => {
    if (loading) {
      return <PageLoading />
    }
    if (!loading && success) {
      return (
        <div>
          <SEO title={'Jira - Success Screen'} />
          <Row
            justify="center"
            className="container bg-image"
            style={{
              minHeight: '100vh',
              minWidth: '100%',
              width: '100%',
            }}
          >
            <Col>
              <Row justify="center" style={{ marginBottom: '-50px' }}>
                <img alt="" height="200" width="200" src="/image/logo.svg"></img>
              </Row>
              <Card className="shadow-lg">
                <Result
                  status="success"
                  title={
                    completed
                      ? 'You have successfully completed the JIRA integration!'
                      : 'You have successfully authenticated with JIRA!'
                  }
                  subTitle={
                    completed || !workspace?.isAdminOrOwner
                      ? 'You can close this window and continue using QualityWatcher.'
                      : 'Match JIRA projects with QualityWatcher to complete integration.'
                  }
                >
                  {workspace?.isAdminOrOwner && (
                    <JiraManageProjects
                      isVisible={true}
                      workspace={workspace}
                      completed={completed}
                      onComplete={() => setCompleted(true)}
                    />
                  )}
                </Result>
              </Card>
            </Col>
          </Row>
        </div>
      )
    }

    if (!loading && !success) {
      return (
        <div>
          <SEO title={'Jira - Error Screen'} />
          <Row
            justify="center"
            className="container bg-image"
            style={{
              minHeight: '100vh',
              minWidth: '100%',
              width: '100%',
            }}
          >
            <Col type="flex" align="middle">
              <Row justify="center" style={{ marginBottom: '-50px' }}>
                <img alt="" height="200" width="200" src="/image/logo.svg"></img>
              </Row>
              <Card className="shadow-lg">
                <Result
                  status="error"
                  title="Unable to confirm your JIRA authentication!"
                  subTitle="Please ensure that you are logged into corresponding JIRA account for this workspace, and/or try connecting again."
                  extra={[
                    <Link onClick={() => (window.location.href = jiraUrl)}>
                      <Button disabled={!jiraUrl} type="primary" key="console">
                        Connect to JIRA
                      </Button>
                    </Link>,
                    <Link to="/">
                      <Button type="ghost" key="console">
                        Go back to QualityWatcher
                      </Button>
                    </Link>,
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )
    }
  }

  return <div>{renderResult()}</div>
}

export default JiraSuccessScreen
