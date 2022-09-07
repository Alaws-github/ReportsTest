import { useState } from 'react'
import { Card, Typography, Menu, Layout, Alert } from 'antd'
import {
  SettingOutlined,
  TeamOutlined,
  AppstoreOutlined,
  PicRightOutlined,
  LayoutOutlined,
} from '@ant-design/icons'
import { useWorkspace } from '../../Context/WorkspaceContext'

import BasicInfo from './BasicInfo'
import Members from './Members'
import Integrations from './Integrations'
import Billing from './Billing'
import Projects from './Projects'

const { Title } = Typography

const Settings = ({ currentSection: cSection }) => {
  const isSubscription = window.location.href.includes('subscription')
  const [currentSection, setCurrentSection] = useState(
    isSubscription ? 'billing' : cSection
  )
  const workspace = useWorkspace()

  const integrationCount = workspace?.projects?.filter(
    (p) => p?.integratedProjectKey
  )?.length

  const workspaceIntegrationCount = workspace?.integrations?.filter(
    (inte) => inte?.integrationType === 'JIRA'
  )?.length

  const isIntegrated = integrationCount === workspaceIntegrationCount

  const menuMap = {
    basic: {
      label: 'Basic Settings',
      title: 'Workspace Basic Settings',
      icon: <SettingOutlined />,
    },
    members: {
      label: 'Manage Team',
      title: 'Manage Team Members',
      icon: <TeamOutlined />,
    },
    projects: {
      label: 'Projects',
      title: 'Projects',
      icon: <LayoutOutlined />,
    },
  }

  if (process.env?.REACT_APP_JIRA_AUTH_LINK) {
    menuMap['integrations'] = {
      label: 'Integrations',
      title: 'Manage Integrations',
      icon: <AppstoreOutlined />,
    }
  }

  menuMap['billing'] = {
    label: 'Subscription',
    title: 'Subscription',
    icon: <PicRightOutlined />,
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
            <BasicInfo workspace={workspace} />
          </MenuContent>
        )

      case 'members':
        return (
          <MenuContent title={menuMap?.[currentSection]?.title}>
            <Members workspace={workspace} />
          </MenuContent>
        )

      case 'integrations':
        return (
          <MenuContent title={menuMap?.[currentSection]?.title}>
            <Integrations workspace={workspace} screen="workspace" />
          </MenuContent>
        )

      case 'billing':
        return (
          <MenuContent title={menuMap?.[currentSection]?.title}>
            <Billing workspace={workspace} />
          </MenuContent>
        )

      case 'projects':
        return (
          <MenuContent title={menuMap?.[currentSection]?.title}>
            <Projects workspace={workspace} />
          </MenuContent>
        )

      default:
        break
    }
    return null
  }
  return (
    <Card>
      {workspace?.isAdminOrOwner && !isIntegrated && (
        <>
          {' '}
          <Alert
            message="Jira Integration Incomplete"
            description="Please go to the Integrations tab and select Manage Projects to complete Jira integration."
            type="error"
            showIcon
          />
          <br />{' '}
        </>
      )}
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
            style={{ padding: '12px 24px 0px 35px', minHeight: 400 }}
          >
            {renderContent()}
          </div>
        </Layout.Content>
      </Layout>
    </Card>
  )
}

export default Settings
