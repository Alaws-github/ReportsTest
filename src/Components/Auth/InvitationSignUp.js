import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Result } from 'antd'
import { Form, Input, Button, Modal } from 'antd'
import { useHistory, Link } from 'react-router-dom'
import { Notification } from '../Common/Feedback'
import { analyticsActions } from '../../Util/util'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import { useUserMutation } from '../../Util/API/User'
import { useEmailMutation } from '../../Util/API/Email'
import { useAuth } from '../../Context/AuthContext'
import PageLoading from '../Common/PageLoader'
import SEO from '../Common/SEO'
import { base64ToJSON } from '../..//Util/util'

function InvitationSignUp(props) {
  const encodedData = props.match.params.encodedData
  const parsedData = base64ToJSON(encodedData)

  const {
    workspace: eWorkspaceName,
    id: wWorkspaceId,
    first_name: eFirstName,
    last_name: eLastName,
    email: eEmail,
    temppassword: eTemp_pass,
    username: eUsername,
  } = parsedData

  const workspaceName = decodeURIComponent(eWorkspaceName)
  const workspaceId = decodeURIComponent(wWorkspaceId)
  const firstName = decodeURIComponent(eFirstName)
  const lastName = decodeURIComponent(eLastName)
  const email = decodeURIComponent(eEmail)
  const temp_pass = decodeURIComponent(eTemp_pass)
  const username = decodeURIComponent(eUsername)

  const [form] = Form.useForm()
  let history = useHistory()
  const [loading, setLoading] = useState(false)
  const { Title } = Typography
  const { completeNewPassword, signIn } = useAuth()
  const { sendReinviteEmail } = useEmailMutation()
  const { setUserInvitationStatus } = useUserMutation()
  const [validUser, setValidUser] = useState()
  const [pageLoading, setPageLoading] = useState(true)
  const [inviteLoading, setInviteLoading] = useState(false)

  function passwordResetSuccessful() {
    Modal.success({
      content: 'You can log in with your email and your password!',
      title: 'Your account is ready!',
      onOk: () => {
        history.push('/login')
      },
    })
  }

  function invitationSentSuccessfully() {
    Modal.success({
      content:
        'The admin has been notified that your invitation has expired and they will send a new link.',
      title: 'Your re-invitation request was sent!',
      onOk: () => {
        history.push('/login')
      },
    })
  }

  useEffect(() => {
    signIn({ email: email, password: temp_pass })
      .then((user) => {
        setPageLoading(false)
        setValidUser(user)
      })
      .catch((error) => {
        setPageLoading(false)
        setValidUser(null)
      })
  }, [])

  const renderPage = () => {
    if (pageLoading) {
      return <PageLoading />
    }

    if (validUser && !pageLoading) {
      return (
        <div>
          <SEO title="Invitation Sign Up" />
          <Row
            justify="center"
            className="container bg-image"
            style={{
              minHeight: '100vh',
              minWidth: '100%',
              width: '100%',
            }}
          >
            <div style={{ maxWidth: '400px', width: '100%' }}>
              <Row
                justify="center"
                style={{ marginTop: -50, marginBottom: '-50px' }}
              >
                <img alt="" height="200" width="200" src="/image/logo.svg"></img>
              </Row>

              <Card
                style={{
                  maxWidth: '400px',
                  marginTop: 8,
                  marginBottom: 8,
                  borderRadius: 4,
                }}
                className="shadow-lg"
              >
                <div style={{ width: '100%', marginTop: 2 }}>
                  <Row justify="center">
                    <Title type="secondary" level={4}>
                      Sign up for your account
                    </Title>
                  </Row>
                  <br />
                  <Form
                    layout="vertical"
                    form={form}
                    name="register"
                    onFinish={(values) => {
                      setLoading(true)
                      completeNewPassword(email, temp_pass, values.password)
                        .then((user) => {
                          setUserInvitationStatus({ user_id: username })
                            .then(() => {
                              console.log({ user })
                              passwordResetSuccessful()
                              analyticsActions.inviteRegister(email)
                              setLoading(false)
                            })
                            .catch((error) => {
                              console.log(error)
                              passwordResetSuccessful()
                              setLoading(false)
                            })
                        })
                        .catch((error) => {
                          Notification('error', '', error.message)
                          setLoading(false)
                        })
                    }}
                    initialValues={{
                      workspace: workspaceName,
                      email: email,
                      firstName: firstName,
                      lastName: lastName,
                    }}
                    scrollToFirstError
                  >
                    <Row justify="space-between">
                      <Col md={11}>
                        <Form.Item
                          name="firstName"
                          label="First Name"
                          hasFeedback
                          rules={[
                            {
                              message: 'Please input your First Name!',
                            },
                          ]}
                        >
                          <Input disabled defaultValue={firstName} size="large" />
                        </Form.Item>
                      </Col>
                      <Col md={11}>
                        <Form.Item
                          name="lastName"
                          label="Last Name"
                          hasFeedback
                          rules={[
                            {
                              message: 'Please input your Last Name!',
                            },
                          ]}
                        >
                          <Input disabled defaultValue={lastName} size="large" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name="workspaceName"
                      label="Workspace Name"
                      hasFeedback
                      rules={[
                        {
                          message: 'Please input your Workspace Name!',
                        },
                      ]}
                    >
                      <Input disabled defaultValue={workspaceName} size="large" />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="E-mail"
                      hasFeedback
                      rules={[
                        {
                          type: 'email',
                          message: 'The input is not a valid Email Address!',
                        },
                        {
                          message: 'Please input your Email Address!',
                        },
                      ]}
                    >
                      <Input disabled defaultValue={email} size="large" />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="New Password"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Password!',
                        },
                        {
                          pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                          message: `Password should be at least 8 characters long, including at least 1 uppercase, 1 lowercase, 1 digit and 1 symbol`,
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password size="large" />
                    </Form.Item>
                    <Form.Item
                      name="confirm"
                      label="Confirm Password"
                      dependencies={['password']}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Please confirm your Password!',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve()
                            }
                            return Promise.reject(
                              new Error(
                                'The two passwords you entered do not match!'
                              )
                            )
                          },
                        }),
                      ]}
                    >
                      <Input.Password size="large" />
                    </Form.Item>
                    <Form.Item
                      name="agreement"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value
                              ? Promise.resolve()
                              : Promise.reject(
                                new Error(
                                  'The Terms and Conditions must be accepted.'
                                )
                              ),
                        },
                      ]}
                    >
                      <Checkbox>
                        I agree with the{' '}
                        <Link
                          onClick={() => {
                            window.open(
                              'https://qualitywatcher.com/terms-of-service',
                              '_blank'
                            )
                          }}
                        >
                          Terms and Conditions.
                        </Link>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        loading={loading}
                        size="large"
                        style={{ width: '100%' }}
                        type="primary"
                        htmlType="submit"
                      >
                        Complete Invitation Sign Up
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </Card>
            </div>
          </Row>
        </div>
      )
    }
    if (!validUser && !pageLoading) {
      return (
        <div>
          <SEO title={'Invitation - Expired Screen'} />
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
                  title="Invitation link has expired"
                  subTitle="Please request a new invitation link using the button below. Your admin will be notified."
                  extra={[
                    <Button
                      loading={inviteLoading}
                      onClick={async () => {
                        setInviteLoading(true)
                        const invitationData = {
                          workspace_id: workspaceId,
                          user_id: username,
                          first_name: firstName,
                          last_name: lastName,
                          email: email,
                        }
                        sendReinviteEmail(invitationData)
                          .then(() => {
                            setInviteLoading(false)
                            invitationSentSuccessfully()
                          })
                          .catch(() => {
                            setInviteLoading(false)
                            Notification(
                              'error',
                              'Please try again later',
                              'Error Sending Re-Invitation!'
                            )
                          })
                      }}
                      type="primary"
                      key="console"
                    >
                      Request Re-Invitation
                    </Button>,
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )
    }
  }

  return <>{renderPage()}</>
}

export default InvitationSignUp
