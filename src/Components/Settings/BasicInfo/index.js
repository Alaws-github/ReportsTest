import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Spin, Row } from 'antd'
import { useWorkspaceMutation } from '../../../Util/API/Workspace'
import { Notification } from '../../Common/Feedback'
import { useWorkspace } from '../../../Context/WorkspaceContext'

const BasicInfo = () => {
  const [form] = Form.useForm()
  const { updateWorkspace } = useWorkspaceMutation()
  const [loading, setLoading] = useState(false)
  const workspace = useWorkspace()

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
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please enter a workspace name',
            },
          ]}
        >
          <Input placeholder={workspace?.workspaceName} />
        </Form.Item>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit">
            Update Workspace Info
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default BasicInfo
