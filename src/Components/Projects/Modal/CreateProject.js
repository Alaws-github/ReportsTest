import React, { useEffect } from 'react'
import { Form, Input, Button, Modal } from 'antd'
const { TextArea } = Input
function CreateProject({
  isVisible,
  onCancel,
  createProject,
  selectedProject,
  editProject,
  loading,
  setLoading,
}) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (selectedProject) {
      form.setFieldsValue({
        title: selectedProject.title,
        description: selectedProject.description,
        type: selectedProject.type,
      })
    } else {
      form.resetFields()
    }
  }, [selectedProject])

  useEffect(() => {
    setLoading(false)
  }, [isVisible])

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      visible={isVisible}
      centered={true}
      title={selectedProject ? 'Edit Project' : 'Create Project'}
      okText="Save"
      footer={null}
      cancelText="Cancel"
      onCancel={onCancel}
    >
      <Form
        layout="vertical"
        form={form}
        name="register"
        onFinish={async (values) => {
          setLoading(true)
          if (selectedProject) {
            editProject(values)
          } else {
            createProject(values).then(() => {
              form.resetFields()
            })
          }
        }}
        initialValues={{}}
        scrollToFirstError
      >
        <Form.Item
          name="title"
          label="Project Name"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please input a project name',
            },
          ]}
        >
          <Input
            defaultValue={selectedProject ? selectedProject?.title : ''}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Project Description"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please input a project description!',
            },
          ]}
        >
          <TextArea
            defaultValue={selectedProject ? selectedProject?.description : ''}
            size="large"
            rows={4}
          />
        </Form.Item>
        <Form.Item
          name="type"
          label="Project Type"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please input a project type',
            },
          ]}
        >
          <Input
            defaultValue={selectedProject ? selectedProject?.type : ''}
            size="large"
          />
        </Form.Item>
        <br></br>
        <Form.Item>
          <Button
            loading={loading}
            size="large"
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
          >
            {selectedProject ? 'Save Project' : 'Create Project'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateProject
