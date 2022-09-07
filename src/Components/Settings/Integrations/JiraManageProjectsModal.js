import React from 'react'
import { Modal } from 'antd'
import JiraManageProjects from '../../Integrations/JiraManageProjects'

const JiraManageProjectsModal = ({ isVisible, setVisible, workspace }) => {
  return (
    <Modal
      visible={isVisible}
      onCancel={() => setVisible(false)}
      footer={null}
      title="JIRA Integration - Manage Projects"
      style={{
        marginTop: 100,
      }}
    >
      <JiraManageProjects
        isVisible={isVisible}
        workspace={workspace}
        onComplete={() => {}}
      />
    </Modal>
  )
}

export default JiraManageProjectsModal
