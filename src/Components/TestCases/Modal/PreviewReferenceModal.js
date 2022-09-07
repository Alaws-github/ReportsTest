import React from 'react'
import { Modal, Tag } from 'antd'
import JiraPreview from '../../Common/JiraPreview'

const PreviewReferenceModal = ({
  isModalVisible,
  setModalVisible,
  referenceKey,
}) => {
  const handleCancel = () => {
    setModalVisible(false)
  }

  return (
    <Modal
      title={
        <span>
          Reference Details Preview
          <Tag style={{ marginLeft: 5 }} color="blue">
            {referenceKey}
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
      <JiraPreview issueId={referenceKey} isVisible={isModalVisible} />
    </Modal>
  )
}

export default PreviewReferenceModal
