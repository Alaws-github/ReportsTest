import React, { useState } from 'react'
import { Card, Row, Col, Divider, Typography } from 'antd'
import { Form, Input, Button, Modal } from 'antd'
import { useAuth } from '../../../Context/AuthContext'
import { useHistory, Link } from 'react-router-dom'
import { Notification } from '../../Common/Feedback'
import { analyticsActions } from '../../../Util/util'
import Checkbox from 'antd/lib/checkbox/Checkbox'
const { Title } = Typography

function RegistrationForm({ planCode, clearPlan, priceId }) {
  const [form] = Form.useForm()
  const { signUp } = useAuth()
  let history = useHistory()
  const [loading, setLoading] = useState(false)

  function registrationSuccessful() {
    Modal.success({
      content: `Email Verification link has been send to ${form.getFieldValue(
        'email'
      )}`,
      title: 'Email Verification Sent!',
      onOk: () => {
        history.push('/login')
      },
    })
  }

  return (
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
          className="logo-qw-mobile"
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
              onFinish={async (values) => {
                setLoading(true)
                try {
                  values.license = planCode
                  values.priceId = priceId
                  await signUp(values)
                  registrationSuccessful()
                  clearPlan()
                  analyticsActions.register(values.email)
                } catch (error) {
                  Notification('error', '', error.message)
                }
                setLoading(false)
              }}
              initialValues={{}}
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
                        required: true,
                        message: 'Please input your First Name!',
                      },
                    ]}
                  >
                    <Input disabled={!planCode} size="large" />
                  </Form.Item>
                </Col>
                <Col md={11}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Last Name!',
                      },
                    ]}
                  >
                    <Input disabled={!planCode} size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="workspaceName"
                label="Workspace Name"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please input your Workspace Name!',
                  },
                ]}
              >
                <Input disabled={!planCode} size="large" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                hasFeedback
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid Email!',
                  },
                  {
                    required: true,
                    message: 'Please input your Email!',
                  },
                ]}
              >
                <Input disabled={!planCode} size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
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
                <Input.Password disabled={!planCode} size="large" />
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
                        new Error('The two passwords you entered do not match!')
                      )
                    },
                  }),
                ]}
              >
                <Input.Password disabled={!planCode} size="large" />
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
                <Checkbox disabled={!planCode}>
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
                  disabled={!planCode}
                >
                  Register
                </Button>
              </Form.Item>
              <Divider />
              <Form.Item>
                <Row justify="center">
                  <Link to="/login">Back to Login? </Link>
                </Row>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </Row>
  )
}

export default RegistrationForm
