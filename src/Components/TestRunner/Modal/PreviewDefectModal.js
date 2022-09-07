import React from 'react'
import { Modal, Tag } from 'antd'
import JiraPreview from '../../Common/JiraPreview'

const PreviewDefectModal = ({ isModalVisible, setModalVisible, defectKey }) => {
  const handleCancel = () => {
    setModalVisible(false)
  }

  return (
    <Modal
      title={
        <span>
          Defect Details Preview
          <Tag style={{ marginLeft: 5 }} color="red">
            {defectKey}
          </Tag>
        </span>
      }
      footer={null}
      visible={isModalVisible}
      onCancel={handleCancel}
      width={800}
      destroyOnClose={true}
      maskClosable={false}
    >
      <JiraPreview isVisible={isModalVisible} issueId={defectKey} />
    </Modal>
  )
}

export default PreviewDefectModal
