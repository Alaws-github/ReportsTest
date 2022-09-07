import { useState } from 'react'
import { Card, Typography, Menu, Layout } from 'antd'
import {
  SettingOutlined,
  AppstoreOutlined,
  ControlOutlined,
} from '@ant-design/icons'
import { useWorkspace } from '../../Context/WorkspaceContext'

import UserBasicInfo from './UserBasicInfo'
import Integrations from './Integrations'
import APIKey from './APIKey'

const { Title } = Typography

const UserSettings = () => {
  const isIntegration = window.location.href.includes('integration')
  const [currentSection, setCurrentSection] = useState(
    isIntegration ? 'integrations' : 'basic'
  )
  const [apiKey, setApiKey] = useState(null)
  const workspace = useWorkspace()

  const menuMap = {
    basic: {
      label: 'Basic Settings',
      title: 'Profile Basic Settings',
      icon: <SettingOutlined />,
    },
  }

  if (!workspace?.isViewer) {
    menuMap['apikey'] = {
      label: 'API Keys',
      title: 'Manage API Keys',
      icon: <ControlOutlined />,
    }
  }

  if (workspace?.integrations?.length > 0) {
    menuMap['integrations'] = {
      label: 'Integrations',
      title: 'Manage Integrations',
      icon: <AppstoreOutlined />,
    }
  }

  const getMenuItems = () => {
    return Object.keys(menuMap).map((item) => {
      const menuItem = menuMap[item]
      return (
        <Menu.Item key={item} icon={menuItem.icon}>
          {menuItem.label}
        </Menu.Item>
      )
    })
  }

  const MenuContent = ({ children, title }) => {
    return (
      <>
        <Title
          style={{
            marginBottom: '15px',
            fontWeight: 500,
            fontSize: '20px',
            lineHeight: '28px',
          }}
        >
          {title}
        </Title>
        {children}
      </>
    )
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'basic':
        return (
          <MenuContent title={menuMap?.[currentSection]?.title}>
            <UserBasicInfo workspace={workspace} />
          </MenuContent>
        )

      case 'integrations':
        return (
          <MenuContent title={menuMap?.[currentSection]?.title}>
            <Integrations workspace={workspace} screen="user" />
          </MenuContent>
        )

      case 'apikey':
        return (
          <MenuContent title={menuMap?.[currentSection]?.title}>
            <APIKey
              setApiKey={setApiKey}
              apiKey={apiKey}
              workspace={workspace}
              screen="user"
            />
          </MenuContent>
        )

      default:
        break
    }
    return null
  }

  return (
    <Card>
      <Layout>
        <Layout.Sider width={256}>
          <Menu
            onClick={({ key }) => setCurrentSection(key)}
            defaultSelectedKeys={[currentSection]}
            mode="inline"
            style={{ height: '100%', width: 256 }}
          >
            {getMenuItems()}
          </Menu>
        </Layout.Sider>
        <Layout.Content className="site-layout-background">
          <div
            className="site-layout-background"
            style={{
              padding: '12px 24px 0px 35px',
              maxHeight: 400,
              minHeight: 400,
            }}
          >
            {renderContent()}
          </div>
        </Layout.Content>
      </Layout>
    </Card>
  )
}

export default UserSettings
