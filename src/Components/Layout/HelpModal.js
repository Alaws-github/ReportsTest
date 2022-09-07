import React, { useState } from 'react'
import { Modal } from 'antd'
import { List } from 'antd'

import {
  RightOutlined,
  PlaySquareOutlined,
  BookOutlined,
} from '@ant-design/icons'

import Onboarding from '../Common/Onboarding'
import { Link } from 'react-router-dom'
import constants from '../../constants'

function HelpModal({ isModalVisible, setIsModalVisible }) {
  const [onboardingVisible, setOnboardingVisible] = useState(false)

  const data = [
    {
      title: 'Getting Started',
      description: 'Learn more about QualityWatcher features',
      onClick: () => {
        setOnboardingVisible(true)
        setIsModalVisible(false)
      },
      icon: <PlaySquareOutlined style={{ fontSize: 16, marginTop: 5 }} />,
    },
    {
      title: 'Guides',
      description: 'Learn about the most important QualityWatcher concepts!',
      onClick: function () {
        window.open(constants.documentationLink, '_blank')
        setIsModalVisible(false)
      },
      icon: <BookOutlined style={{ fontSize: 16, marginTop: 5 }} />,
    },
  ]
  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  return (
    <div>
      <Modal
        title="Help"
        visible={isModalVisible}
        onOk={handleOk}
        footer={null}
        onCancel={handleCancel}
      >
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <Link>
              <List.Item onClick={item.onClick}>
                <List.Item.Meta
                  avatar={item.icon}
                  title={<Link onClick={item.onClick}>{item.title}</Link>}
                  description={item.description}
                />
                <RightOutlined />
              </List.Item>
            </Link>
          )}
        />
      </Modal>
      <Onboarding
        isModalVisible={onboardingVisible}
        setIsModalVisible={setOnboardingVisible}
        onClose={() => {
          setOnboardingVisible(false)
        }}
      />
    </div>
  )
}

export default HelpModal
