import React, { useEffect, useState } from 'react'
import { Col, Layout, Menu, Row, Avatar } from 'antd'
import { useAuth } from '../../Context/AuthContext'
import Banner from './Banner'
import './style.css'
import { useLocation, Link, useRouteMatch } from 'react-router-dom'

import {
  SettingOutlined,
  PieChartOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  FolderOpenOutlined,
  UserOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
import UserAvatarIcon from '../Common/UserAvatarIcon'
import HelpModal from './HelpModal'
import SettingsModal from './SettingsModal'
import { useWorkspace } from '../../Context/WorkspaceContext'
import { createProjectIcon } from '../../Util/util'

const MainLayout = ({ children }) => {
  const match = useRouteMatch('/:projectId')
  const projectId = match?.params?.projectId
  const { Content } = Layout
  const { SubMenu } = Menu
  const location = useLocation()
  const { signOut, currentUser } = useAuth()
  const [currentKey, setCurrentKey] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isSettingVisible, setIsSettingsVisible] = useState(false)
  const [showAdminSettings, setShowAdminSettings] = useState(false)
  const [userSettingsTrigger, setUserSettingsTrigger] = useState(false)
  const [currentProject, setCurrentProject] = useState('')
  const workspace = useWorkspace()

  const setPath = () => {
    if (location.pathname.includes('/overview')) {
      setCurrentKey('1')
    }
    if (
      location.pathname.includes('/test-runs') ||
      location.pathname.includes(['/test-runner'])
    ) {
      setCurrentKey('2')
    }
    if (
      location.pathname.includes(['/test-suite']) ||
      location.pathname.includes(['/test-cases'])
    ) {
      setCurrentKey('3')
    }
    if (location.pathname.includes(['/reports'])) {
      setCurrentKey('4')
    }
  }

  useEffect(() => {
    setPath()
    if (workspace?.isAdminOrOwner && workspace?.projects?.length > 0)
      setShowAdminSettings(true)
  })

  useEffect(() => {
    if (
      window.location.href.includes('#workspace-settings') &&
      showAdminSettings
    ) {
      setIsSettingsVisible(true)
    }
  }, [])

  useEffect(() => {
    const cProject = workspace?.getProject(projectId)
    if (JSON.stringify(cProject) !== JSON.stringify(currentProject)) {
      setCurrentProject(cProject)
    }
  }, [workspace, projectId, currentProject])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Banner user={currentUser} />
      <Layout>
        <Row style={{ backgroundColor: '#001628', height: 46 }}>
          <Col md={2}>
            <div className="logo" />
          </Col>
          <Col md={22}>
            <Menu selectedKeys={[currentKey]} theme="dark" mode="horizontal">
              <Menu.Item
                onClick={() => {
                  setCurrentKey('1')
                }}
                key="1"
                icon={<PieChartOutlined />}
              >
                <Link to={`/${projectId}/overview`}>Overview</Link>
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setCurrentKey('2')
                }}
                key="2"
                icon={<SettingOutlined />}
              >
                <Link to={`/${projectId}/test-runs`}>Test Runs</Link>
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setCurrentKey('3')
                }}
                key="3"
                icon={<FileDoneOutlined />}
              >
                <Link to={`/${projectId}/test-suites`}>Test Suites</Link>
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setCurrentKey('4')
                }}
                key="4"
                icon={<LineChartOutlined />}
              >
                <Link to={`/${projectId}/reports`}>Reports</Link>
              </Menu.Item>

              <SubMenu
                style={{ float: 'right' }}
                key="SubMenu"
                icon={<UserAvatarIcon />}
              >
                <Menu.Item
                  onClick={() => {
                    setUserSettingsTrigger(true)
                    setIsSettingsVisible(true)
                  }}
                  key="setting:3"
                  icon={<UserOutlined />}
                >
                  Profile Settings
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    signOut()
                  }}
                  key="setting:2"
                  icon={<LogoutOutlined />}
                >
                  {' '}
                  Logout
                </Menu.Item>
              </SubMenu>
              {showAdminSettings && (
                <Menu.Item
                  style={{ float: 'right' }}
                  onClick={() => {
                    setIsSettingsVisible(true)
                  }}
                  icon={<SettingOutlined />}
                >
                  {`${workspace?.workspaceName} Settings`}
                </Menu.Item>
              )}
              <Menu.Item
                style={{ float: 'right' }}
                onClick={() => {
                  setIsModalVisible(true)
                }}
                icon={<QuestionCircleOutlined />}
              >
                Help
              </Menu.Item>
              <SubMenu
                style={{ float: 'right', color: 'white' }}
                key="project"
                title={currentProject?.title}
                icon={
                  <Avatar
                    size={13}
                    src={createProjectIcon(currentProject?.title)}
                    style={{ marginRight: '10px' }}
                  />
                }
              >
                <Menu.Item
                  onClick={() => { }}
                  key="setting:2"
                  icon={<FolderOpenOutlined />}
                >
                  <Link to="/">Go To Projects</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Col>
        </Row>

        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            background: '#F0F3F4',
          }}
        >
          <div>{children}</div>
        </Content>
      </Layout>
      <HelpModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onClose={() => {
          setIsModalVisible(false)
        }}
      />
      <SettingsModal
        isSettingsVisible={isSettingVisible}
        setIsSettingsVisible={setIsSettingsVisible}
        userSettingsTrigger={userSettingsTrigger}
        setUserSettingsTrigger={setUserSettingsTrigger}
      />
    </Layout>
  )
}

export default MainLayout
