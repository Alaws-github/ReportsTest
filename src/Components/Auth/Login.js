import React, { useState, useEffect } from 'react'
import { Card, Divider, Row } from 'antd'
import { Form, Input, Button } from 'antd'
import { useAuth } from '../../Context/AuthContext'
import { useHistory, Link, useLocation } from 'react-router-dom'
import { Notification } from '../Common/Feedback'
import { Typography } from 'antd'
import SEO from '../Common/SEO'
import { analyticsActions } from '../../Util/util'
function Login() {
  const [form] = Form.useForm()
  const { signIn, currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  let history = useHistory()
  let location = useLocation()
  const { Title } = Typography
  const params = new URLSearchParams(location?.search)
  const nextPage = params.get('nextPage')

  useEffect(() => {
    if (currentUser) {
      history.push('/')
    }
  }, [currentUser])

  return (
    <div>
      <SEO title="Login" />
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
              marginBottom: 4,
              borderRadius: 4,
            }}
            className="shadow-lg"
          >
            <div style={{ width: '100%', marginTop: 2 }}>
              <Row justify="center">
                <Title type="secondary" level={4}>
                  Log in to your account
                </Title>
              </Row>
              <br />
              <Form
                layout="vertical"
                form={form}
                name="register"
                onFinish={async (values) => {
                  setLoading(true)
                  await signIn(values)
                    .then((data) => {
                      Notification('success', '', 'Login Successful')
                      if (nextPage) {
                        params.delete('nextPage')
                        history.push({
                          pathname: nextPage,
                          search: params.toString(),
                        })
                      } else {
                        history.push('/')
                      }
                      analyticsActions.login({
                        userId: data.attributes.sub,
                        email: data.attributes.email,
                      })
                    })
                    .catch((error) => {
                      Notification('error', '', error.message)
                    })
                  setLoading(false)
                }}
                initialValues={{}}
                scrollToFirstError
              >
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
                      required: true,
                      message: 'Please input your Email Address!',
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Password!',
                    },
                  ]}
                >
                  <Input.Password size="large" />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loading}
                    size="large"
                    style={{ width: '100%' }}
                    type="primary"
                    htmlType="submit"
                  >
                    Login
                  </Button>
                </Form.Item>
                <Divider />
                <Form.Item>
                  <Row justify="space-between">
                    <Link to="/forgot-password">Forgot Password?</Link>

                    <Link to="/register">Sign up for an account</Link>
                  </Row>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </div>
      </Row>
    </div>
  )
}

export default Login
