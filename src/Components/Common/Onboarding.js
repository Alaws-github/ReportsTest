import React, { useState, useRef } from 'react'
import { Modal, Carousel, Button, Row } from 'antd'
import Title from 'antd/lib/typography/Title'
import Text from 'antd/lib/typography/Text'
import { CloseCircleOutlined, CaretRightOutlined } from '@ant-design/icons'
import './carocel.css'

function Onboarding({ isModalVisible, onClose }) {
  const [slide, setSlide] = useState(0)
  const slider = useRef()

  const handleOk = () => {
    onClose()
  }

  const handleCancel = () => {
    setSlide(0)
    onClose()
  }

  const data = [
    {
      title: 'Welcome to QualityWatcher',
      subTitle: `We'll provide these steps to help you get started with the tool`,
      imageLocation: '/image/onboarding/Welcome.png',
      description:
        'Swipe through these images to get an understanding of how to use the various sections.',
    },
    {
      title: 'Create Your Start Project',
      subTitle: `Your QualityWatcher journey starts here`,
      imageLocation: '/image/onboarding/Project.png',
      description: 'Create your Project to start building your Test Suites',
    },
    {
      title: 'Create a Test Suite',
      subTitle: `Once you have created your Project, you can create your first test suite`,
      imageLocation: '/image/onboarding/EmptyState.png',
      description:
        'You will be able to create multiple test suites in your Project',
    },
    {
      title: 'Choose Templates that Match Your Project',
      subTitle: `Create your suite easily using our pre-built templates, or build your own suite.`,
      imageLocation: '/image/onboarding/Templates.png',
      description:
        'Use our pre-defined templates that best match your project to help ramp up your testing efforts.',
    },
    {
      title: 'Create Custom Test Suites and Test Cases',
      subTitle: `Take a hands-on approach to creating your test suite`,
      imageLocation: '/image/onboarding/TestSuite.png',
      description:
        'Fill in the details for your custom Test Suites and Test Cases',
    },
    {
      title: 'Edit Test Cases',
      subTitle: ` `,
      imageLocation: '/image/onboarding/TestCase.png',
      description: 'Edit Test Cases easily when managing your suite',
    },
    {
      title: 'Perform a Test Run on Test Suites',
      subTitle: `Track your Test Runs with our dynamic controls`,
      imageLocation: '/image/onboarding/TestRun2.png',
      description:
        'Navigate and keep track of all your testing in your Test Runs',
    },
    {
      title: 'Perform a Test Run on Test Suites',
      subTitle: `Track your Test Runs with our dynamic controls`,
      imageLocation: '/image/onboarding/TestRun.png',
      description:
        'Provide status and details information for your Test Results',
    },
    {
      title: 'Overview',
      subTitle: `Get a comprehensive view of your Test Results`,
      imageLocation: '/image/onboarding/Overview.png',
      description: 'Get a full picture of your project’s testing results',
    },
  ]
  return (
    <>
      <Modal
        destroyOnClose
        footer={null}
        width={800}
        centered
        visible={isModalVisible}
        onOk={handleOk}
        closeIcon={<CloseCircleOutlined />}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <div>
          <Carousel
            adaptiveHeight={true}
            infinite={false}
            ref={slider}
            afterChange={(current) => {
              setSlide(current)
            }}
          >
            {data.map((item) => {
              return (
                <div>
                  <Row justify="center">
                    <Title level={3}>{item.title}</Title>
                  </Row>
                  <Row justify="center">
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 15,
                        color: '#595959',
                      }}
                    >
                      {item.subTitle}
                    </Text>
                  </Row>
                  <div>
                    <img
                      style={{ marginTop: 10, marginBottom: 15 }}
                      alt=""
                      height={470}
                      width="100%"
                      src={item.imageLocation}
                    ></img>
                    <Row
                      style={{ height: 100, overflow: 'auto' }}
                      justify="center"
                    >
                      <Text style={{ textAlign: 'center' }}>
                        {item.description}
                      </Text>
                    </Row>
                  </div>
                </div>
              )
            })}
          </Carousel>
          <Row style={{ marginTop: -20 }} justify="end">
            <Button
              disabled={slide === 0}
              style={{ marginRight: 10 }}
              onClick={() => {
                slider.current.prev()
              }}
              type=""
            >
              Back
            </Button>
            {slide === 8 ? (
              <Button
                onClick={() => {
                  handleOk()
                }}
                type="primary"
              >
                Enjoy!
              </Button>
            ) : (
              <Button
                onClick={() => {
                  slider.current.next()
                }}
                type="primary"
              >
                Next Step <CaretRightOutlined />
              </Button>
            )}
          </Row>
        </div>
      </Modal>
    </>
  )
}

export default Onboarding
