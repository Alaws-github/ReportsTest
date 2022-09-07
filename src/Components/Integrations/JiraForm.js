import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Select, Divider, Typography, Tooltip } from 'antd'
import { useGetJiraProjects } from '../../Util/API/Jira'
import { QuestionCircleOutlined } from '@ant-design/icons'
const { Text } = Typography
const { Option } = Select

const JiraForm = ({ project, workspace, onMatch, isVisible, completed }) => {
  const [form] = Form.useForm()
  const [startAt, setStartAt] = useState(0)
  const { data, isLoading } = useGetJiraProjects({ startAt, isVisible })
  const [jiraProjects, setJiraProjects] = useState([])

  const handleChange = (value) => {
    form.setFieldsValue({ jiraProject: value })
  }

  const onScroll = (event) => {
    var target = event.target
    if (
      !isLoading &&
      data?.total !== jiraProjects?.length &&
      target.scrollTop + target.offsetHeight === target.scrollHeight
    ) {
      target.scrollTo(0, target.scrollHeight)
      setStartAt(jiraProjects?.length + 1)
    }
  }

  useEffect(() => {
    if (data?.projects && !data?.projects?.includes(undefined)) {
      const projects = data.projects.reduce((prevProject, project) => {
        const projectOption = {
          value: JSON.stringify(project),
          label: `[${project?.projectKey}] ${project?.projectName}`,
          key: project?.projectId,
        }

        return [
          ...prevProject,
          <Option key={projectOption.key} value={projectOption.value}>
            {projectOption.label}
          </Option>,
        ]
      }, [])

      setJiraProjects([...jiraProjects, ...projects])
    }
  }, [data])

  return (
    <>
      <Text
        style={{
          fontWeight: 'normal',
          paddingBottom: '10px',
        }}
      >
        {project?.title}{' '}
        <Tooltip title="Match this QualityWatcher project to a JIRA project to complete integration.">
          <QuestionCircleOutlined />
        </Tooltip>
        :
      </Text>
      <Form
        layout="inline"
        form={form}
        name="control-hooks"
        onFinish={({ jiraProject }) => {
          onMatch({
            jiraProject,
            project,
          })
        }}
      >
        <Form.Item
          style={{
            width: '70%',
          }}
          name="jiraProject"
          rules={[
            {
              required: true,
              message: 'Please select matching JIRA project',
            },
          ]}
        >
          <Select
            disabled={workspace?.isAdminOrOwner ? completed : true}
            placeholder="Select matching JIRA project"
            onChange={handleChange}
            defaultValue={
              project?.integratedProjectKey
                ? `[${project?.integratedProjectKey}] - ${project?.integratedProjectName}`
                : 'Select matching JIRA project'
            }
            onPopupScroll={onScroll}
          >
            {!isLoading
              ? jiraProjects
              : [...jiraProjects, <Option key="loading">Loading...</Option>]}
          </Select>
        </Form.Item>

        {workspace?.user?.isAdminOrOwner && (
          <Form.Item>
            <Row justify="end">
              <Button
                style={{
                  width: '100%',
                }}
                type="primary"
                htmlType="submit"
              >
                Match
              </Button>
            </Row>
          </Form.Item>
        )}
      </Form>
      <Divider />
    </>
  )
}

export default JiraForm
