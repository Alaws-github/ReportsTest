import React, { useState } from 'react'
import { Form, Input } from 'antd'
import { useWorkspaceMutation } from '../../../Util/API/Workspace'
import { Notification } from '../../Common/Feedback'

const UserBasicInfo = ({ workspace }) => {
  const [form] = Form.useForm()
  const { updateWorkspace } = useWorkspaceMutation()
  const [loading, setLoading] = useState(false)
  const { user } = workspace

  const onFinish = (data) => {
    setLoading(true)
    data.id = workspace.workspaceId
    updateWorkspace(data)
      .then((response) => {
        Notification(
          'success',
          'Your workspace name was updated successfully!',
          'Updated workspace info'
        )
        setLoading(false)
      })
      .catch((error) => {
        Notification(
          'error',
          'Could not update workspace info. Please try again later!',
          'Unable to update workspace info'
        )
        setLoading(false)
      })
  }

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="control-hooks"
        onFinish={onFinish}
      >
        <Form.Item
          name="first-name"
          label="First Name"
          rules={[
            {
              required: true,
              message: 'Please enter your first name.',
            },
          ]}
        >
          <Input disabled={true} placeholder={user?.first_name} />
        </Form.Item>
        <Form.Item
          name="last-name"
          label="Last Name"
          rules={[
            {
              required: true,
              message: 'Please enter your last name.',
            },
          ]}
        >
          <Input placeholder={user?.last_name} disabled={true} />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: 'Please enter your email.',
            },
          ]}
        >
          <Input placeholder={user?.email} disabled={true} />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[
            {
              required: true,
              message: 'Please enter your role.',
            },
          ]}
        >
          <Input placeholder={user?.role} disabled={true} />
        </Form.Item>
      </Form>
    </>
  )
}

export default UserBasicInfo
