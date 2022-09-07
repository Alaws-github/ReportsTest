import React, { useState, useEffect } from 'react'
import {
  Card,
  List,
  Typography,
  Tag,
  Avatar,
  Tooltip,
  Skeleton,
  Popconfirm,
} from 'antd'
import { Link } from 'react-router-dom'
import {
  EditOutlined,
  FolderOpenOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'
import EllipsisTooltip from '../Common/EllipsisTooltip'
import ViewerTooltip from '../Common/ViewerTooltip'
import { createProjectIcon } from '../../Util/util'
import { useUser } from '../../Context/UserContext'
import CustomEmptyState from '../Common/CustomEmptyState'

const { Paragraph, Text } = Typography
const { Meta } = Card

const iconStyle = {
  fontSize: 18,
}

const ProjectsList = ({
  projects,
  history,
  loading,
  onEdit,
  onArchive,
  selectedProject,
  setSelectedProject,
}) => {
  const { isViewer, isEditor, isAdminOrOwner } = useUser()
  const [isVisible, setIsVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const skipAction = isViewer || isEditor

  return (
    <>
      <List
        loading={confirmLoading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 6,
        }}
        locale={{
          emptyText: (
            <CustomEmptyState
              text={
                <>
                  <Text type="secondary">
                    There are no active project/s, but there are
                    archived project/s within this workspace.
                  </Text>
                  <br />
                  {isAdminOrOwner ? (
                    <Text type="secondary">
                      You can either create a new project or restore an archived
                      project from the{' '}
                      <Link to="/?settings=projects">
                        Workspace Projects Settings
                      </Link>
                    </Text>
                  ) : (
                    <Text type="secondary">
                      Ask your admin to either create a new project or restore
                      an archived project.
                    </Text>
                  )}
                </>
              }
              style={{ marginTop: '15%' }}
            />
          ),
        }}
        dataSource={projects?.sort((a, b) => a.id - b.id)}
        renderItem={(project) => (
          <List.Item>
            <Card
              bordered={false}
              style={{ width: 270 }}
              actions={[
                <ViewerTooltip
                  isViewer={isViewer || isEditor}
                  title="Archive project"
                >
                  <Popconfirm
                    onVisibleChange={(visible) => setIsVisible(visible)}
                    disabled={isViewer && isEditor}
                    onConfirm={() => {
                      if (skipAction) return
                      setConfirmLoading(true)
                      onArchive(project?.id).then(() => {
                        setConfirmLoading(false)
                        setSelectedProject(null)
                        setIsVisible(false)
                      })
                    }}
                    visible={isVisible && selectedProject?.id === project?.id}
                    okButtonProps={{ loading: confirmLoading }}
                    onCancel={() => setIsVisible(false)}
                    title="Are you sure you want to archive this project?"
                  >
                    <MinusCircleOutlined
                      disabled={true}
                      onClick={() => {
                        if (skipAction) return
                        setSelectedProject(project)
                        setIsVisible(true)
                      }}
                      key="delete"
                      style={iconStyle}
                    />
                  </Popconfirm>
                </ViewerTooltip>,
                <ViewerTooltip
                  isViewer={isViewer || isEditor}
                  title="Edit project"
                >
                  <EditOutlined
                    disabled={true}
                    onClick={() => {
                      if (skipAction) return
                      onEdit(project)
                    }}
                    key="edit"
                    style={iconStyle}
                  />
                </ViewerTooltip>,
                <Tooltip title="View project">
                  <Link to={`/${project?.customId}/overview`}>
                    <FolderOpenOutlined key="overview" style={iconStyle} />
                  </Link>
                </Tooltip>,
              ]}
            >
              <div
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  history.push(`/${project.customId}/overview`)
                }}
              >
                <Skeleton loading={loading} avatar active>
                  <Meta
                    avatar={<Avatar src={createProjectIcon(project.title)} />}
                    title={
                      <EllipsisTooltip title={project?.title}>
                        {project?.title}
                      </EllipsisTooltip>
                    }
                    description={
                      <>
                        <Paragraph
                          type="secondary"
                          style={{ marginTop: 10 }}
                          ellipsis={{
                            rows: 1,
                            expandable: false,
                            tooltip: project?.description,
                          }}
                        >
                          {project?.description}
                        </Paragraph>
                        <Tag>
                          <Text type="secondary">{project?.type}</Text>
                        </Tag>
                      </>
                    }
                  />
                </Skeleton>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </>
  )
}

export default ProjectsList
