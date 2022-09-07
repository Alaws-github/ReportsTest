import Auth from '@aws-amplify/auth'
import { Button, Col, Result, Row, Card } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLoading from '../Common/PageLoader'
import { useAuth } from '../../Context/AuthContext'
import { Notification } from '../Common/Feedback'
import SEO from '../Common/SEO'
import { base64ToJSON } from '../..//Util/util'
function ConfirmSignUp(props) {
  const encodedData = props.match.params.encodedData
  const parsedData = base64ToJSON(encodedData)

  const { user_name, confirmation_code } = parsedData

  const { sendVerificationCode } = useAuth()

  const [success, setSuccess] = useState(true)
  const [loading, setLoading] = useState(true)

  async function confirmUser() {
    try {
      let result = await Auth.confirmSignUp(user_name, confirmation_code)
      console.log(result)
      setLoading(false)
      setSuccess(true)
    } catch (error) {
      Notification('error', '', error.message)
      console.log(error)
      setSuccess(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    confirmUser()
  }, [])

  const renderResult = () => {
    if (loading) {
      return <PageLoading />
    }
    if (!loading && success) {
      return (
        <div>
          <SEO title="Confirm Sign Up" />
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
                  status="success"
                  title="Your account has been successfully registered!"
                  subTitle="You can now log in to the application, click the button below to go to the login page"
                  extra={[
                    <Link to="/login">
                      <Button type="primary" key="console">
                        Go To Login Page
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

    if (!loading && !success) {
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
          <Col type="flex" align="middle">
            <Row justify="center" style={{ marginBottom: '-50px' }}>
              <img alt="" height="200" width="200" src="/image/logo.svg"></img>
            </Row>
            <Card className="shadow-lg">
              <Result
                status="error"
                title="Unable to confirm user"
                subTitle=""
                extra={[
                  <Link to="/login">
                    <Button type="ghost" key="console">
                      Go To Login Page
                    </Button>
                  </Link>,
                  <Button
                    onClick={async () => {
                      try {
                        sendVerificationCode(user_name)
                        Notification(
                          'success',
                          'Check your email for a new verification link',
                          'Email Resent!'
                        )
                      } catch (error) {
                        Notification(
                          'error',
                          'Please try again later',
                          'Error Resending Email!'
                        )
                      }
                    }}
                    type="primary"
                    key="console"
                  >
                    Resend Verification Link
                  </Button>,
                ]}
              />
            </Card>
          </Col>
        </Row>
      )
    }
  }

  return <div>{renderResult()}</div>
}

export default ConfirmSignUp
