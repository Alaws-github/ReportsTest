import {
  Form,
  Input,
  Button,
  Space,
  Radio,
  Tooltip,
  Typography,
  Avatar,
  List,
  Modal,
  Row,
  Card,
  Select,
  Tag,
  Divider,
  Spin,
  Popconfirm,
} from 'antd'
import {
  MinusCircleOutlined,
  PlusOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Notification } from '../../Common/Feedback'

import { useWorkspaceMutation } from '../../../Util/API/Workspace'
import {
  useGetWorkspaceUserList,
  useUserMutation,
} from '../../../Util/API/User'

const Members = ({ workspace }) => {
  const [form] = Form.useForm()
  const [members, setMembers] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const {
    inviteUserToWorkspace,
    reinviteUserToWorkspace,
  } = useWorkspaceMutation()
  const { enableUser, disableUser, changeUserRole } = useUserMutation()
  const { workspaceId, user: currentUserInfo } = workspace
  const { data: workspaceUsers, isLoading } = useGetWorkspaceUserList(
    workspaceId
  )
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(false)
  const [invitationList, setInvitationList] = useState([])

  const handleNotifications = (responseData) => {
    for (let i = 0; i < responseData.length; i++) {
      const currentResponse = responseData[i]
      if (!Object.keys(currentResponse).includes('error')) {
        Notification(
          'success',
          `Invitation was successfully sent to ${currentResponse?.email}!`,
          'Invitation sent!'
        )
      } else {
        Notification(
          'error',
          `Unable to send an invitation to ${currentResponse?.error?.email}.`,
          `Invitation not sent`
        )
      }
    }
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const membersList = values?.members?.map((member) => {
        const _member = {
          workspaceId,
          ...member,
        }
        return _member
      })

      const response = await inviteUserToWorkspace(membersList)
      handleNotifications(response)
      setLoading(false)
      if (response) {
      }
    } catch (error) {
      if (Array.isArray(error)) {
        handleNotifications(error)
      } else {
        Notification(
          'error',
          `${error.message}`,
          'Unable to send an invitation'
        )
      }
      setLoading(false)
    }
    form.resetFields()
  }

  const roles = [
    {
      name: 'Administrator',
      description:
        'Admin users have access to all workspace and projects setting',
      value: 'Admin',
    },
    {
      name: 'Editor',
      description: 'Editors can manage and run tests for one or more projects',
      value: 'Editor',
    },
    {
      name: 'Viewer',
      description: 'Viewers can view tests and track the progress',
      value: 'Viewer',
    },
  ]

  const ChangeRoleModal = ({ user, isVisible, setIsVisible }) => {
    const [value, setValue] = useState(user?.role)
    const [userChangeLoading, setUserChangeLoading] = useState(false)

    const onChange = (e) => {
      setValue(e.target.value)
    }

    const saveUserRole = () => {
      setUserChangeLoading(true)
      const data = {
        user_id: user.id,
        role: value,
      }
      changeUserRole(data)
        .then(() => {
          setUserChangeLoading(false)
          Notification(
            'success',
            `Permissions for ${user.email} was successfully changed to ${value}!`,
            'User role was changed!'
          )
        })
        .catch(() => {
          setUserChangeLoading(false)
          Notification(
            'error',
            `Could not change user role for ${user.email}. Please try again later!`,
            'Unable to change user role!'
          )
        })
    }

    return (
      <Modal
        onCancel={() => setIsVisible(false)}
        visible={isVisible}
        title={`Change Role (${user?.email})`}
        footer={null}
        style={{
          marginTop: 100,
        }}
      >
        <Card title={null}>
          <Radio.Group onChange={onChange} defaultValue={value}>
            <Space size={80}>
              {roles.map((role) => (
                <Tooltip title={role.description} key={role.value}>
                  <Radio value={role.value}>{role.name}</Radio>
                </Tooltip>
              ))}
            </Space>
          </Radio.Group>
        </Card>
        <Row style={{ marginTop: 30 }} justify="center">
          <Button
            onClick={() => saveUserRole()}
            disabled={value === user?.role}
            type="primary"
            loading={userChangeLoading}
          >
            Save Role
          </Button>
        </Row>
      </Modal>
    )
  }

  const changeRole = (userInfo) => {
    setUserInfo(userInfo)
    setIsVisible(true)
  }

  const resendInvitation = (userInfo) => {
    const data = {
      workspaceId,
      firstName: userInfo.first_name,
      lastName: userInfo.last_name,
      email: userInfo.email,
    }
    setListLoading(true)
    reinviteUserToWorkspace(data)
      .then(() => {
        setListLoading(false)
        Notification(
          'success',
          `A new invitation was successfully sent to ${userInfo.email}!`,
          'Invitation sent!'
        )
      })
      .catch(() => {
        setListLoading(false)
        Notification(
          'error',
          `Could not send an invitation to ${userInfo.email}. Please check the email and try again later!`,
          'Unable to send an invitation'
        )
      })
  }

  const enableOrDisableUser = (userInfo) => {
    setListLoading(true)
    const data = {
      user_id: userInfo.id,
    }
    if (userInfo.isActive) {
      disableUser(data)
        .then(() => {
          setListLoading(false)
          Notification(
            'success',
            `${userInfo.email} was successfully disabled!`,
            'User is disabled!'
          )
        })
        .catch(() => {
          setListLoading(false)
          Notification(
            'error',
            `Could not disable user: ${userInfo.email}. Please try again later!`,
            'Unable to disable user!'
          )
        })
    } else {
      enableUser(data)
        .then(() => {
          setListLoading(false)
          Notification(
            'success',
            `${userInfo.email} was successfully enabled!`,
            'User is enabled!'
          )
        })
        .catch(() => {
          setListLoading(false)
          Notification(
            'error',
            `Could not enable user: ${userInfo.email}. Please try again later!`,
            'Unable to enable user!'
          )
        })
    }
  }

  const DisplayStatus = ({ status, isCurrentUser }) => {
    const color = {
      accepted: 'success',
      expired: 'error',
      pending: 'processing',
    }
    if (isCurrentUser) return <></>
    return <Tag color={color[status]}>{status}</Tag>
  }

  useEffect(() => {
    if (workspaceUsers?.length > 0) {
      setMembers(workspaceUsers)
    }
  }, [workspaceUsers])

  return (
    <>
      {!isLoading ? (
        <div>
          <div style={{ marginBottom: 10 }}>
            {members?.length ? (
              <List
                loading={listLoading}
                dataSource={members}
                itemLayout="horizontal"
                renderItem={(item) => {
                  const actions = []
                  const isCurrentUser = currentUserInfo.email === item.email
                  const isOwner = currentUserInfo?.isOwner
                  const isOwnerRole = item?.role === 'Owner'
                  if (item.status === 'expired') {
                    actions.push(
                      <Popconfirm
                        title="Are you sure you want to re-send this invitation?"
                        onConfirm={() => resendInvitation(item)}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button key="list-memeber-edit" type="link">
                          Resend Invitation
                        </Button>
                      </Popconfirm>
                    )
                  }
                  if (isCurrentUser | isOwner | isOwnerRole) {
                    if (isOwnerRole) {
                      actions.push(
                        <Tooltip title="Not allowed to change owner role.">
                          <Button type="link" key="list-memeber-edit" disabled>
                            Change Role
                          </Button>
                        </Tooltip>
                      )
                    } else {
                      actions.push(
                        <Tooltip title="Not allowed to change your own role since you are an admin.">
                          <Button type="link" key="list-memeber-edit" disabled>
                            Change Role
                          </Button>
                        </Tooltip>
                      )
                    }
                  } else {
                    actions.push(
                      <Button
                        type="link"
                        key="list-memeber-edit"
                        onClick={() => changeRole(item)}
                      >
                        Change Role
                      </Button>
                    )
                  }

                  if (isCurrentUser | isOwner | isOwnerRole) {
                    if (isOwnerRole) {
                      actions.push(
                        <Tooltip title="Not allowed to disable an owner.">
                          <Button
                            disabled
                            type="link"
                            key="list-member-delete"
                            onClick={() => {}}
                          >
                            Disable
                          </Button>
                        </Tooltip>
                      )
                    } else {
                      actions.push(
                        <Tooltip title="Not allowed to disable yourself since you are an admin.">
                          <Button
                            disabled
                            type="link"
                            key="list-member-delete"
                            onClick={() => {}}
                          >
                            Disable
                          </Button>
                        </Tooltip>
                      )
                    }
                  } else {
                    actions.push(
                      <Popconfirm
                        title={`Are you sure you want to ${
                          item.isActive ? 'disable' : 'enable'
                        } this user?`}
                        onConfirm={() => enableOrDisableUser(item)}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="link" key="list-member-delete">
                          {item.isActive ? 'Disable' : 'Enable'}
                        </Button>
                      </Popconfirm>
                    )
                  }

                  return (
                    <List.Item actions={actions}>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={<>{item.email}</>}
                        description={
                          <>
                            <DisplayStatus
                              isCurrentUser={isCurrentUser}
                              status={item.status}
                            />
                            {item.role}
                          </>
                        }
                      />
                    </List.Item>
                  )
                }}
              />
            ) : (
              <Typography.Text className="ant-form-text" type="secondary">
                ( <SmileOutlined /> No team member/s yet. )
              </Typography.Text>
            )}
          </div>
          <Form
            name="dynamic_form_nest_item"
            onFinish={onFinish}
            autoComplete="off"
            form={form}
            layout="horizontal"
          >
            <Form.List name="members">
              {(fields, { add, remove }) => (
                <>
                  {members.length > 0 && (
                    <Divider
                      style={{
                        marginTop: 1,
                      }}
                    />
                  )}
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'firstName']}
                        fieldKey={[fieldKey, 'firstName']}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: 'Please enter a First Name',
                          },
                        ]}
                      >
                        <Input placeholder="First Name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'lastName']}
                        fieldKey={[fieldKey, 'lastName']}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: 'Please enter a Last Name',
                          },
                        ]}
                      >
                        <Input placeholder="Last Name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'email']}
                        hasFeedback
                        fieldKey={[fieldKey, 'email']}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter an Email Address',
                          },
                          {
                            type: 'email',
                            message: 'The input is not a valid Email Address!',
                          },
                        ]}
                      >
                        <Input
                          style={{
                            minWidth: '180px',
                          }}
                          placeholder="Email"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'role']}
                        fieldKey={[fieldKey, 'role']}
                        rules={[
                          {
                            required: true,
                            message: 'Please assign the relevant role',
                          },
                        ]}
                      >
                        <Select
                          style={{ width: 150 }}
                          placeholder="Select a role"
                        >
                          <Select.Option value={roles[2].value}>
                            {roles[2].name}
                          </Select.Option>
                          <Select.Option value={roles[1].value}>
                            {roles[1].name}
                          </Select.Option>
                          <Select.Option value={roles[0].value}>
                            {roles[0].name}
                          </Select.Option>
                        </Select>
                      </Form.Item>

                      <Tooltip title="Remove">
                        <MinusCircleOutlined
                          onClick={() => {
                            invitationList.shift()
                            setInvitationList([...invitationList])
                            remove(name)
                          }}
                        />
                      </Tooltip>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        setInvitationList([...invitationList, 'invite'])
                        add()
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add team member
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            {invitationList.length > 0 && (
              <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit">
                  Send Invitation
                </Button>
              </Form.Item>
            )}
          </Form>
          <ChangeRoleModal
            user={userInfo}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />
        </div>
      ) : (
        <Row justify="center" align="middle">
          <Spin />
        </Row>
      )}
    </>
  )
}

export default Members
