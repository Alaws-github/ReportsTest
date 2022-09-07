import React, { useState } from 'react'
import { List, Button, Avatar, Popconfirm, Typography, Tag } from 'antd'
import CustomEmptyState from '../../Common/CustomEmptyState'
import { createProjectIcon } from '../../../Util/util'
const { Text } = Typography
const ProjectsList = ({
  projects,
  onArchive,
  isLoading = false,
  archived = false,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  return (
    <List
      locale={{ emptyText: <CustomEmptyState text="No projects found" /> }}
      loading={isLoading}
      itemLayout="horizontal"
      dataSource={projects}
      renderItem={(project) => {
        return (
          <List.Item
            actions={[
              <>
                <Popconfirm
                  onVisibleChange={(visible) => setIsVisible(visible)}
                  title={`Are you sure you want to ${archived ? 'Unarchive' : 'Archive'
                    } this project?`}
                  onConfirm={() => {
                    onArchive(project?.id)
                    setIsVisible(false)
                    setSelectedProject(null)
                  }}
                  visible={isVisible && project?.id === selectedProject?.id}
                  onCancel={() => setIsVisible(false)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button onClick={() => {
                    setSelectedProject(project)
                    setIsVisible(true)
                  }} type="link">
                    {archived ? 'Unarchive' : 'Archive'}
                  </Button>
                </Popconfirm>
              </>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={createProjectIcon(project.title)} />}
              title={project.title}
              description={
                <>
                  <Tag>
                    <Text type="secondary">{project?.type}</Text>
                  </Tag>
                  <Text type="secondary">{`${project?.description}`}</Text>
                </>
              }
            />
          </List.Item>
        )
      }}
    />
  )
}

export default ProjectsList
