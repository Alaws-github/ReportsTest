import { List, Avatar, Typography, Popconfirm, Spin } from 'antd'
import { useEffect, useState } from 'react'
import JiraManageProjectsModal from './JiraManageProjectsModal'
import { Notification } from '../../Common/Feedback'
import { getJiraAuthLink } from '../../../Util/util'
import { useJiraMutation } from '../../../Util/API/Jira'

const { Link } = Typography

const Integrations = ({ workspace, screen }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [jiraData, setJiraData] = useState('')
  const {
    disconnectJiraFromWorkspace,
    disconnectJiraFromUser,
  } = useJiraMutation()
  const [loading, setLoading] = useState(false)
  const onFinish = (data) => {
    setJiraData(data)
    setIsVisible(false)
  }
  const { user, isAdminOrOwner } = workspace
  const jiraLink = getJiraAuthLink(user.id)

  const data = [
    {
      title: 'Jira',
      description: jiraData
        ? jiraData
        : 'Please connect to your Jira to start the integration.',
      action: jiraData ? 'Disconnect' : 'Connect',
      logo: 'https://seetyah.s3.amazonaws.com/jiralog.png',
      href: jiraLink,
      target: '_blank',
      onClick: () => {},
      extra: {
        action: 'Manage Projects',
        onClick: () => {
          setIsVisible(true)
        },
      },
    },
    // {
    //   title: 'Slack',
    //   description: 'Please login to start the integration',
    //   action: 'Login',
    //   logo: 'https://seetyah.s3.amazonaws.com/slacklogo.jpeg',
    //   onClick: () => {},
    // },
    // {
    //   title: 'Missing Integration',
    //   description: `Don't see what you are looking for? Let us know what integration you would like.`,
    //   action: 'Send Request',
    //   logo: '',
    //   onClick: () => {},
    // },
  ]

  const disconnectFromJira = async () => {
    if (screen === 'workspace') {
      setLoading(true)
      try {
        await disconnectJiraFromWorkspace()
        Notification(
          'success',
          'You have successfully disconnect this workspace from Jira!'
        )
        setLoading(false)
      } catch (error) {
        Notification(
          'error',
          'Could not disconnect from Jira. Please try again later!'
        )
        setLoading(false)
      }
    }

    if (screen === 'user') {
      setLoading(true)
      try {
        await disconnectJiraFromUser()
        Notification('success', 'You have successfully disconnected from Jira!')
        setLoading(false)
      } catch (error) {
        Notification(
          'error',
          'Could not disconnect from Jira. Please try again later!'
        )
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (workspace?.integrations?.length > 0 && screen === 'workspace') {
      const jiraIntegrationData = workspace?.integrations.filter(
        (integration) => integration.integrationType === 'JIRA'
      )[0]
      if (jiraIntegrationData?.hostUrl) {
        setJiraData(jiraIntegrationData.hostUrl)
      }
    }

    if (workspace?.user?.integrations?.length > 0 && screen === 'user') {
      const jiraIntegrationData = workspace?.integrations.filter(
        (integration) => integration.integrationType === 'JIRA'
      )[0]
      if (jiraIntegrationData?.hostUrl) {
        setJiraData(jiraIntegrationData.hostUrl)
      }
    }
  }, [workspace])

  return (
    <Spin spinning={loading}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => {
          const actions = []
          if (item.extra && jiraData && isAdminOrOwner) {
            actions.push(
              <Link
                key="list-edit-projects-integration"
                onClick={item.extra.onClick}
              >
                {item.extra.action}
              </Link>
            )
          }
          if (!item.href) {
            actions.push(
              <Link key="list-edit-integration" onClick={item.onClick}>
                {item.action}
              </Link>
            )
          } else {
            if (item.action === 'Disconnect') {
              actions.push(
                <Popconfirm
                  title={`${
                    screen === 'workspace'
                      ? 'Are you sure you want to disconnect Jira from this workspace?'
                      : 'Are you sure you want to disconnect from Jira?'
                  }`}
                  onConfirm={disconnectFromJira}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <Link>{item.action}</Link>
                </Popconfirm>
              )
            } else {
              actions.push(
                <Link
                  onClick={item.onClick}
                  href={item.href}
                  target={item.target}
                >
                  {item.action}
                </Link>
              )
            }
          }

          return (
            <List.Item actions={actions}>
              <List.Item.Meta
                avatar={<Avatar shape="square" src={item.logo} size="large" />}
                title={<a href="https://ant.design">{item.title}</a>}
                description={item.description}
              />
            </List.Item>
          )
        }}
      />
      <JiraManageProjectsModal
        isVisible={isVisible}
        setVisible={setIsVisible}
        onSave={onFinish}
        workspace={workspace}
      />
    </Spin>
  )
}

export default Integrations
