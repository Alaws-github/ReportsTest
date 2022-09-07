import React, { useEffect, useState } from 'react'
import { Form, Card, Input, Modal, Button, Row, Typography } from 'antd'
import { useHistory } from 'react-router-dom'
import {
  useProjectsMutation,
  useGetArchivedProjects,
} from '../../Util/API/Projects'
import { useGetUser, useUserMutation } from '../../Util/API/User'
import { useAuth } from '../../Context/AuthContext'
import { useWorkspace } from '../../Context/WorkspaceContext'
import HeaderLayout from '../Layout/HeaderLayout'
import StandaloneLayout from '../Layout/StandaloneLayout'
import PageLoader from '../Common/PageLoader'
import { Notification } from '../Common/Feedback'
import ProjectsList from './ProjectsList'
import Onboarding from '../Common/Onboarding'
import PrimaryPageHeader from '../Layout/PrimaryPageHeader'
import PageContentContainer from '../Layout/PageContentContainer'
import CreateProject from './Modal/CreateProject'
import WelcomeScreen from '../Billing/WelcomeScreen'
import SEO from '../Common/SEO'

function Projects() {
  const { currentUser } = useAuth()
  const { createProject, updateProject, deleteProject } = useProjectsMutation()
  const { data: archivedProjects } = useGetArchivedProjects()
  const { updateUser } = useUserMutation()
  const { data: user } = useGetUser()
  const history = useHistory()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [projectLoading, setProjectLoading] = useState(false)
  const [hasProject, setHasProject] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const { TextArea } = Input
  const { Title } = Typography
  const workspace = useWorkspace()

  const listOfProjects = workspace?.projects
  const hasArchivedProjects = archivedProjects?.length > 0

  useEffect(() => {
    if (listOfProjects && listOfProjects?.length === 0) {
      setHasProject('No')
    } else {
      setHasProject('Yes')
    }
    if (workspace?.workspaceName) {
      localStorage.setItem('workspaceName', workspace?.workspaceName)
    }
  }, [listOfProjects])

  useEffect(() => {
    if (user?.onboarding_completed === false) {
      setIsModalVisible(true)
    } else {
      setIsModalVisible(false)
    }
  }, [user])

  function createProjectSuccessful(project) {
    Modal.success({
      content: `${form.getFieldValue(
        'title'
      )} has been created, you can now create your test suite🥳`,
      title: 'Project Created Successfully!',
      onOk: () => {
        setHasProject('Yes')
        history.push(`/${project?.customId}/test-suites`)
      },
    })
  }

  function handleCreateProject(values) {
    values.author = currentUser.attributes.sub
    return createProject(values)
      .then(() => {
        Notification('success', 'Project Created Successfully!')
        setIsVisible(false)
        setProjectLoading(false)
      })
      .catch((error) => {
        console.log({ error })
        Notification('error', `${error.message}`, `Could not create project!`)
        setProjectLoading(false)
      })
  }

  function handleArchiveProject(projectId) {
    return deleteProject(projectId)
      .then(() => {
        Notification('success', 'Project Archived Successfully!')
        setIsVisible(false)
      })
      .catch(() => {
        Notification(
          'error',
          `Could not archive project!`,
          `Could not archive project, please try again later!`
        )
      })
  }

  function handleEditProject(values) {
    values.id = selectedProject?.id
    return updateProject(values)
      .then(() => {
        Notification('success', 'Project Updated Successfully!')
        setLoading(false)
        setIsVisible(false)
      })
      .catch(() => {
        Notification(
          'error',
          `Could not update project!`,
          `Could not update project, please try again later!`
        )
        setLoading(false)
      })
  }

  function renderScreen() {
    if (!listOfProjects || !archivedProjects) {
      return <PageLoader />
    }

    if (hasProject === 'No' && workspace?.plan_status === 'pending') {
      return (
        <div>
          <SEO title="Welcome Screen - Continue Checkout" />
          <StandaloneLayout noPadding>
            <Row
              justify="center"
              className="container"
              style={{
                height: '95vh',
                minHeight: '80vh',
                minWidth: '100%',
                width: '100vw',
                overflowX: 'hidden',
              }}
            >
              <WelcomeScreen />
            </Row>
          </StandaloneLayout>
        </div>
      )
    }

    if (
      hasArchivedProjects &&
      workspace?.plan_status === 'active' &&
      hasProject === 'No'
    ) {
      return (
        <>
          <SEO title="Projects - Archived" />
          <HeaderLayout>
            <div>
              <PrimaryPageHeader
                disableForEditor
                loading={loading}
                title="Projects"
                description="Find all your projects here"
                leftButtonLabel="New Project"
                onClick={() => {
                  setSelectedProject(null)
                  setIsVisible(true)
                }}
              />
              <PageContentContainer>
                <ProjectsList
                  history={history}
                  projects={workspace?.projects}
                  loading={workspace?.isLoading}
                  onEdit={(project) => {
                    setSelectedProject(project)
                    setIsVisible(true)
                  }}
                  onArchive={handleArchiveProject}
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
              </PageContentContainer>
            </div>
          </HeaderLayout>
        </>
      )
    }

    if (hasProject === 'No' && workspace?.plan_status === 'active') {
      return (
        <div>
          <SEO title="Projects - First Project" />
          <HeaderLayout>
            <div>
              <Row
                justify="center"
                className="container"
                style={{
                  minHeight: '80vh',
                  minWidth: '100%',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    maxWidth: '500px',
                    width: '100%',
                    overflow: 'auto !important',
                  }}
                >
                  <Row
                    justify="center"
                    style={{ marginTop: -50, marginBottom: '-50px' }}
                  >
                    <img
                      alt=""
                      height="200"
                      width="200"
                      src="/image/logo.svg"
                    ></img>
                  </Row>

                  <Card
                    style={{
                      maxWidth: '600px',
                      marginTop: 8,
                      marginBottom: 4,
                      borderRadius: 4,
                    }}
                    className="shadow-lg"
                  >
                    <div style={{ width: '100%', marginTop: 2 }}>
                      <Row justify="center">
                        <Title type="secondary" level={4}>
                          Create Your First Project
                        </Title>
                      </Row>
                      <br />
                      <Form
                        layout="vertical"
                        form={form}
                        name="register"
                        onFinish={async (values) => {
                          setLoading(true)
                          try {
                            values.author = currentUser.attributes.sub
                            createProject(values).then((project) => {
                              setSelectedProject(null)
                              createProjectSuccessful(project)
                            })
                          } catch (error) {
                            Notification('error', ` `, error.message)
                          }
                          setLoading(false)
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
                          <Input size="large" />
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
                          <TextArea size="large" rows={4} />
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
                          <Input size="large" />
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
                            Create Project
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </Card>
                </div>
              </Row>
            </div>
          </HeaderLayout>
        </div>
      )
    }

    if (hasProject === 'Yes') {
      return (
        <div>
          <SEO title={'Projects - List'} />
          <HeaderLayout>
            <div>
              <PrimaryPageHeader
                disableForEditor
                loading={loading}
                title="Projects"
                description="Find all your projects here"
                leftButtonLabel="New Project"
                onClick={() => {
                  setSelectedProject(null)
                  setIsVisible(true)
                }}
              />
              <PageContentContainer>
                <ProjectsList
                  history={history}
                  projects={workspace?.projects}
                  loading={workspace?.isLoading}
                  onEdit={(project) => {
                    setSelectedProject(project)
                    setIsVisible(true)
                  }}
                  onArchive={handleArchiveProject}
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
              </PageContentContainer>
            </div>
          </HeaderLayout>
        </div>
      )
    }

    return <PageLoader />
  }
  return (
    <>
      {renderScreen()}
      <Onboarding
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onClose={() => {
          updateUser({
            id: currentUser.attributes.sub,
            onboarding_completed: true,
          })
            .then(() => { })
            .catch((error) => {
              // Notification('error','Something went ')
            })
          setIsModalVisible(false)
        }}
      />
      <CreateProject
        isVisible={isVisible}
        onCancel={() => setIsVisible(false)}
        createProject={handleCreateProject}
        editProject={handleEditProject}
        selectedProject={selectedProject}
        loading={projectLoading}
        setLoading={setProjectLoading}
      />
    </>
  )
}

export default Projects
