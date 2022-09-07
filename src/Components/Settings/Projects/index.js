import React, { useState } from 'react'
import { Row, Typography, Divider, Spin } from 'antd'
import ProjectsList from './ProjectsList'
import { Notification } from '../../Common/Feedback'

import {
  useGetArchivedProjects,
  useProjectsMutation,
} from '../../../Util/API/Projects'
const { Text } = Typography
const Projects = ({ workspace }) => {
  const [archiving, setArchiving] = useState(false)
  const { deleteProject, unArchiveProject } = useProjectsMutation()
  const { data: archivedProjects, isLoading } = useGetArchivedProjects()
  return (
    <Spin spinning={archiving}>
      <Row align="middle" justify="space-between">
        <Text>Find all your projects here</Text>
      </Row>
      <div
        style={{
          minHeight: 300,
          overflow: 'auto',
        }}
      >
        <ProjectsList
          projects={workspace.projects}
          onArchive={(projectId) => {
            setArchiving(true)
            deleteProject(projectId).then(() => {
              setArchiving(false)
              Notification('success', 'Project archived successfully!')
            }).catch(() => {
              setArchiving(false)
              Notification('error', 'Unable to archive project! Please try again later.')
            })
          }}
        />
        <Divider>Archived Projects</Divider>
        <ProjectsList
          archived={true}
          isLoading={isLoading}
          projects={archivedProjects?.length > 0 ? archivedProjects : []}
          onArchive={(projectId) => {
            setArchiving(true)
            unArchiveProject(projectId).then(() => {
              setArchiving(false)
              Notification('success', 'Project unarchived successfully!')
            }).catch(() => {
              setArchiving(false)
              Notification('error', 'Unable to unarchive project! Please try again later.')
            })
          }}
        />
      </div>
    </Spin>
  )
}

export default Projects
