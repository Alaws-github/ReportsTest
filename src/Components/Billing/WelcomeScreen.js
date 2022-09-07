import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Row, Divider } from 'antd'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import { WhiteCircleIcon } from '../Common/CustomIcons'
import { NewHereQuestionIcon } from '../Common/CustomIcons'
import { useMedia } from '../../Hooks'
import { useBillingMutation } from '../../Util/API/Billing/index'
import './styles.css'

const WelcomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const titleLevel = useMedia(null, [3, 1], 3)
  const descriptionLevel = useMedia(null, [5, 3], 2)
  const vpbtnW = useMedia(null, ['100%', '25%'], '100%')
  const vpbH = useMedia(null, ['2.5rem', '3rem'], '2.5rem')
  const { createCheckoutSession } = useBillingMutation()
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
      }}
      className="without-plan"
    >
      <WhiteCircleIcon className="white-circle-icon" />
      <NewHereQuestionIcon className="new-here-question-icon" />
      <Card
        style={{
          overflow: 'auto',
        }}
        className="new-here-card"
      >
        <Row>
          <div className="new-here-card-content">
            <Title
              className="new-here-card-title"
              level={titleLevel}
              style={{ color: '#3993DC' }}
            >
              Welcome to QualityWatcher
            </Title>
            <Title
              style={{
                color: '#3993DC',
                marginTop: '.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
              }}
              level={descriptionLevel}
            >
              You are almost done!
            </Title>
            <Button
              type="primary"
              loading={isLoading}
              onClick={async () => {
                setIsLoading(true)
                try {
                  const { url } = await createCheckoutSession()
                  window.open(url, '_self')
                } catch (error) {
                  setIsLoading(false)
                  console.error('Could not create checkout session', error)
                }
              }}
              style={{
                backgroundColor: '#34C295',
                borderColor: '#34C295',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: vpbH,
                width: vpbtnW,
              }}
            >
              <Text
                style={{
                  fontSize: '1rem',
                  color: 'white',
                  fontWeight: 'bold',
                }}
                className="btn-view-plans-text"
              >
                Continue to Checkout
              </Text>
            </Button>
            <Divider
              style={{
                color: '#3993DC',
                marginTop: '1.5rem',
              }}
            >
              OR
            </Divider>
            <Row
              align="middle"
              style={{
                textAlign: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: '1rem',
                }}
                type="secondary"
              >
                Not ready to start yet?
              </Text>
              <Link to="/login">
                <Text
                  underline
                  style={{
                    color: '#3993DC',
                    marginLeft: '.2rem',
                    fontSize: '1rem',
                    textAlign: 'center',
                  }}
                >
                  Log out.
                </Text>
              </Link>
            </Row>
          </div>
        </Row>
      </Card>
    </div>
  )
}

export default WelcomeScreen
