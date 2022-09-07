import React, { useRef, useState, useEffect } from 'react'
import { Row, Typography, Button, Modal } from 'antd'
import TypeForm from '../Common/TypeForm'
import { useGetUser, useUserMutation } from '../../Util/API/User'

const { Title } = Typography

const Banner = ({ user }) => {
  const { data: userData } = useGetUser()
  const { updateUser } = useUserMutation()

  const formRef = useRef(null)
  const [showBanner, setShowBanner] = useState(false)
  const surveyLink = `${process.env.REACT_APP_SURVEY_LINK}#email=${user?.attributes?.email}&userid=${user?.attributes?.sub}&source=qualitywatcher-app`

  const handleClick = () => {
    formRef.current.typeform.open()
  }

  const handleSuccessSubmission = () => {
    Modal.success({
      content: `Thank you, ${user?.attributes?.given_name}!`,
      title: 'Feedback Sent Successfully!',
      onOk: () => {
        setShowBanner(false)
      },
    })
  }

  const handleSubmit = () => {
    formRef.current.typeform.close()
    updateUser({ ...userData, survey_completed: true })
      .then(() => {
        handleSuccessSubmission()
      })
      .catch(() => {
        console.log('update user settings failed: survey_completed')
      })
  }

  useEffect(() => {
    if (
      userData &&
      userData.test_runner_used === true &&
      userData.survey_completed === false &&
      !process.env.NODE_ENV === 'development'
    ) {
      setShowBanner(true)
    }
  }, [userData])

  const renderBanner = () => {
    if (showBanner)
      return (
        <>
          <Row
            style={{
              backgroundColor: '#314EEA',
              height: 45,
            }}
            align="middle"
            justify="center"
          >
            <Title
              style={{
                color: 'white',
                marginBottom: 0,
              }}
              level={5}
            >
              Congratulations! 🎉 You have used more than 80% of the
              QualityWatcher Beta features.{' '}
            </Title>
            <Button size="small" onClick={handleClick} type="text">
              <Title
                style={{
                  color: 'white',
                  marginBottom: 0,
                }}
                level={5}
                underline
              >
                Share your thoughts
              </Title>
            </Button>
          </Row>
          <TypeForm
            ref={formRef}
            hideFooter={false}
            hideHeaders={false}
            link={surveyLink}
            onSubmit={handleSubmit}
          />
        </>
      )

    return null
  }

  return renderBanner()
}

export default Banner
