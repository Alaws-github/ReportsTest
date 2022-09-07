import React, { useState } from 'react'
import { Card, Divider, Row, Typography } from 'antd'
import { Form, Input, Button, notification, Modal } from 'antd';
import { useAuth } from '../../Context/AuthContext'
import { useHistory, Link } from "react-router-dom";
import SEO from '../Common/SEO';

function ForgotPassword() {
  const [form] = Form.useForm();
  const { sendResetPassword, forgotPasswordSubmit } = useAuth()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState()
  const { Title } = Typography;
  const [loading, setLoading] = useState(false)
  let history = useHistory();

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  function sendCodeSuccessful() {
    Modal.success({
      content: `A password reset code has been sent to : ${form.getFieldValue(
        'email'
      )}`,
      title: 'Verification Code Sent!',
      onOk: () => {
        setStep(2)
      }
    });
  }
  function passwordResetSuccessful() {
    Modal.success({
      content: `You can now login with your updated password`,
      title: 'Password Reset Successfully!',
      onOk: () => {
        history.push('/login')
      }
    });
  }

  function forgetPasswordSteps() {
    if (step === 1) {
      return (
        <Form
          layout='vertical'
          form={form}
          name="register"
          onFinish={async (values) => {
            setLoading(true)
            console.log(values)
            try {
              await sendResetPassword(values.email)
              setEmail(values.email)
              sendCodeSuccessful()
            } catch (error) {
              openNotificationWithIcon('error', '', error.message)
            }
            setLoading(false)
          }}
          initialValues={{

          }}
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="We'll send a recovery code to"
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
            <Input placeholder="Enter email address" size='large' />
          </Form.Item>

          <Form.Item>
            <Button
              loading={loading}
              style={{ width: '100%' }}
              size='large'
              type="primary"
              htmlType="submit"
            >
              Send Recovery Code
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item>
            <Row justify="center">
              <Link to="/login">Back to Login?</Link>
            </Row>
          </Form.Item>
        </Form>
      )
    }
    if (step === 2) {
      return (
        <Form
          layout='vertical'
          form={form}
          name="register"
          onFinish={async (values) => {
            setLoading(true)
            try {
              await forgotPasswordSubmit(values)
              setEmail(values.email)
              passwordResetSuccessful()
            } catch (error) {
              openNotificationWithIcon('error', '', error.message)
            }
            setLoading(false)
          }}
          initialValues={{

          }}
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="E-mail"
            initialValue={email}
            rules={[
              {
                type: 'email',
                message: 'The input is not a valid Email Address!'
              },
              {
                required: true,
                message: 'Please input your Email Address!'
              },
            ]}
          >
            <Input disabled size='large' />
          </Form.Item>
          <Form.Item
            name="code"
            label="Verification Code"
            rules={[
              {
                required: true,
                message: 'Please input the Verification Code'
              }
            ]}
          >
            <Input style={{ width: '100%' }} size='large' />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              {
                required: true,
                message: 'Please input the new Password',
              },
              {
                pattern: /(?=.*[A-Z])\w+(?=.*[!@_#-+(^=&)*+])(?=.*[0-9])(?=.*[a-z]).{8}/,
                message: `Password should be at least 8 characters long, including at least 1 uppercase, 1 lowercase and 1 symbol`,
              }
            ]}
          >
            <Input.Password size='large' />
          </Form.Item>

          <Form.Item>
            <Button
              loading={loading}
              size="large"
              style={{ width: '100%' }}
              type="primary"
              htmlType="submit"
            >
              Reset Password
            </Button>
          </Form.Item>
          <Divider />
          <Form.Item>
            <Row justify="center">
              <Link to="/login">Back to Login?</Link>
            </Row>
          </Form.Item>
        </Form>
      )
    }
  }

  return (
    <div>
      <SEO title={'Forgot Password'} />
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
          <Row justify='center' style={{ marginTop: -50, marginBottom: '-50px' }}>
            <img alt="" height="200" width="200" src="/image/logo.svg"></img>
          </Row>

          <Card
            style={{
              maxWidth: '400px',
              marginTop: 8,
              marginBottom: 4,
              borderRadius: 4
            }}
            className="shadow-lg"
          >
            <div style={{ width: '100%', marginTop: 2 }}>
              <Row justify="center">
                <Title type="secondary" level={4}>
                  Can't log in?
                </Title>
              </Row>
              <br />
              {forgetPasswordSteps()}
            </div>
          </Card>
        </div>
      </Row>
    </div>
  )
}

export default ForgotPassword
