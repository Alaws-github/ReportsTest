import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
const NewSection = ({
  visible,
  onCancel,
  onCreate,
  loading,
  currentSection,
  type,
}) => {
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({
      name: currentSection?.name || '',
    })
  })
  return (
    <Modal
      title={currentSection ? 'Edit Section' : 'New Section'}
      centered
      visible={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
      maskClosable={false}
      destroyOnClose
      cancelText="Cancel"
      okText={currentSection ? 'Save' : 'Create'}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values)
          })
          .catch((info) => {})
      }}
    >
      <Form
        layout="vertical"
        form={form}
        name="new-section-form"
        onFinish={onCreate}
      >
        <Form.Item
          label="Section Name"
          name="name"
          rules={[{ required: true, message: 'Please input a section name!' }]}
        >
          <Input placeholder="Enter a name for your section" size="large" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default NewSection
