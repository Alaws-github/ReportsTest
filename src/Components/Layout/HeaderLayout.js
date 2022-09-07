import React, { useState, useEffect } from 'react'
import { Layout, Menu, Row, Col } from 'antd'
import { useAuth } from '../../Context/AuthContext'
import './style.css'
import {
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import UserAvatarIcon from '../Common/UserAvatarIcon'
import SettingsModal from './SettingsModal'
import { useWorkspace } from '../../Context/WorkspaceContext'
import { useGetArchivedProjects } from '../../Util/API/Projects'

const HeaderLayout = ({ children }) => {
  const workspace = useWorkspace()
  const { data: archivedProjects } = useGetArchivedProjects()

  const { Content } = Layout
  const { SubMenu } = Menu
  const { signOut } = useAuth()
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
  const [showAdminSettings, setShowAdminSettings] = useState(false)
  const [userSettingsTrigger, setUserSettingsTrigger] = useState(false)

  useEffect(() => {
    if (workspace?.isAdminOrOwner && workspace?.projects?.length > 0)
      setShowAdminSettings(true)
  })

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Layout className="site-layout">
          <Row style={{ backgroundColor: '#001628', height: 46 }}>
            <Col md={2}>
              <div className="logo" />
            </Col>
            <Col md={22}>
              <Menu theme="dark" mode="horizontal">
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
              </Menu>
            </Col>
          </Row>
          <Content
            style={{
              padding: 24,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
      <SettingsModal
        isSettingsVisible={isSettingsVisible}
        setIsSettingsVisible={setIsSettingsVisible}
        userSettingsTrigger={userSettingsTrigger}
        setUserSettingsTrigger={setUserSettingsTrigger}
      />
    </>
  )
}

export default HeaderLayout
