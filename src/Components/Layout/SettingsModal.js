import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import Settings from '../Settings/workspaceSettings'
import UserSettings from '../Settings/userSettings'
import { withRouter } from 'react-router-dom'

const SettingsModal = ({
  isSettingsVisible,
  setIsSettingsVisible,
  userSettingsTrigger,
  setUserSettingsTrigger,
  history,
}) => {
  const [currentSection, setCurrentSection] = useState('basic')

  const handleOk = () => {
    setIsSettingsVisible(false)
    setUserSettingsTrigger(false)
  }

  const handleCancel = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.hash = ''
    currentUrl.search = ''
    window.history.replaceState({}, document.title, currentUrl.toString())
    setIsSettingsVisible(false)
    setUserSettingsTrigger(false)
  }

  useEffect(() => {
    history.listen(() => {
      const currentUrl = new URL(window.location.href)
      let params = new URL(document.location).searchParams
      if (currentUrl.search.includes('settings')) {
        setIsSettingsVisible(true)
        setCurrentSection(params.get('settings'))
      }
    })
  }, [])

  useEffect(() => {
    window.addEventListener('load', function (e) {
      if (window.location.hash.includes('user-jira-integration')) {
        setIsSettingsVisible(true)
        setUserSettingsTrigger(true)
      }

      if (window.location.hash.includes('workspace-settings-subscription')) {
        setIsSettingsVisible(true)
      }

      if (
        window.location.hash.includes('workspace-settings-subscription-success')
      ) {
        setIsSettingsVisible(true)
      }
    })
    return () => window.removeEventListener('load', null)
  }, [])

  return (
    <div>
      <Modal
        title={userSettingsTrigger ? 'Profile Settings' : 'Workspace Settings'}
        visible={isSettingsVisible}
        onOk={handleOk}
        footer={null}
        onCancel={handleCancel}
        width={1100}
        maskClosable={false}
      >
        {userSettingsTrigger ? (
          <UserSettings history={history} />
        ) : (
          <Settings history={history} currentSection={currentSection} />
        )}
      </Modal>
    </div>
  )
}

export default withRouter(SettingsModal)
