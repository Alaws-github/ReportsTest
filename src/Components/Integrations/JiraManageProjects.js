import React, { useState } from 'react'
import { Spin } from 'antd'
import { useProjectsMutation } from '../../Util/API/Projects'
import { Notification } from '../Common/Feedback'
import JiraForm from './JiraForm'

const JiraManageProjects = ({
  isVisible,
  workspace,
  completed = false,
  onComplete,
}) => {
  const [savingProject, setSavingProject] = useState(false)
  const { updateProject } = useProjectsMutation()

  const onMatch = ({ jiraProject, project }) => {
    let jiraProjectDetails = JSON.parse(jiraProject)

    setSavingProject(true)
    const payload = {
      id: project?.id,
      project_key: jiraProjectDetails?.projectKey,
      project_id: jiraProjectDetails?.projectId,
      project_name: jiraProjectDetails?.projectName,
    }

    updateProject(payload)
      .then((response) => {
        Notification(
          'success',
          `${response?.title} is matched to [${jiraProjectDetails?.projectKey}] - ${jiraProjectDetails?.projectName}`,
          `You have successfully completed the Jira Integration!`
        )
        if (workspace) {
          const inteCount = workspace?.projects?.filter(
            (p) => p?.integratedProjectId
          )?.length

          const workspaceInteCount = workspace?.integrations?.filter(
            (inte) => inte?.integrationType === 'JIRA'
          )?.length

          if (inteCount === workspaceInteCount) onComplete()
        }
        setSavingProject(false)
      })
      .catch(() => {
        Notification(
          'error',
          `Could not match the Jira project to complete integration! Please try again later!`
        )
        setSavingProject(false)
      })
  }

  return (
    <Spin spinning={savingProject}>
      {workspace &&
        workspace?.projects?.map((project) => (
          <JiraForm
            project={project}
            isVisible={isVisible}
            workspace={workspace}
            onMatch={onMatch}
            completed={completed}
          />
        ))}
    </Spin>
  )
}

export default JiraManageProjects
