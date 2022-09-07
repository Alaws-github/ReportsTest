import React, { useState, useEffect } from 'react'
import { Col, PageHeader, Row, Progress, Typography, Space, Button } from 'antd'
import { useHistory } from 'react-router-dom'
import TestCaseList from './TestCaseList'
import TestCasePreview from '../Common/TestCasePreview'
import { Notification } from '../Common/Feedback'
import {
  GetTestRunData,
  useTestRunnerMutation,
} from '../../Util/API/TestRunner'
import { useGetSectionsForSuites } from '../../Util/API/TestRuns'
import { useGetUser, useUserMutation } from '../../Util/API/User'
import { calculatePercentage } from '../../Util/util'
import PageLoader from '../Common/PageLoader'
import TestCaseControl from './TestCaseControl'
import TestSummary from './TestSummary'
import TestCaseNavigator from './TestCaseNavigator'
import StatusTag from '../Common/StatusTag'
import ReportSummary from './ReportSummary'
import EllipsisTooltip from '../Common/EllipsisTooltip'
import { useUser } from '../../Context/UserContext'
import { useWorkspace } from '../../Context/WorkspaceContext'
import ElapsedTime from '../Common/ElapsedTime'
import SEO from '../Common/SEO'

const { Title } = Typography
const TestRunnerPage = (props) => {
  const workspace = useWorkspace()
  const { isViewer } = useUser()
  const { data: userPersona } = useGetUser()
  const { updateUser } = useUserMutation()
  const [tab, setTab] = useState('1')
  let customExecutionId = props.match.params.id
  let customProjectId = props.match.params.projectId
  const projectId = workspace.getProject(customProjectId)?.id
  const { data: testRunData, isLoading } = GetTestRunData({ customExecutionId, projectId })
  const testSuites = [
    ...new Set(testRunData?.testRunCases?.map((trc) => trc.suiteId)),
  ]

  const sections = useGetSectionsForSuites(
    testSuites?.map((ts) => {
      return { id: ts }
    })
  )


  testRunData?.testRunCases.sort((a, b) => a.testRunId - b.testRunId)
  const {
    updateTestRunStatus,
    addComment,
    updateComment,
  } = useTestRunnerMutation()
  const history = useHistory()
  const [selectedTestCase, setSelectedTestCase] = useState({
    testCase: testRunData?.testRunCases[0],
    index: 0,
  })
  const [refs, setRefs] = useState(null)

  const handleScroll = (id) => {
    refs[id].current.scrollIntoView({
      behavior: 'auto',
      block: 'center',
    })
    window.scrollBy(0, -400)
  }

  const handlePrevious = () => {
    const backTick = selectedTestCase.index - 1
    if (backTick > -1) {
      setSelectedTestCase({
        testCase: testRunData.testRunCases[backTick],
        index: backTick,
      })
      handleScroll(backTick)
    } else {
      const lastIndex = testRunData.testRunCases.length - 1
      setSelectedTestCase({
        testCase: testRunData.testRunCases[lastIndex],
        index: lastIndex,
      })
      handleScroll(lastIndex)
    }
  }

  const handleNext = () => {
    const nextTick = selectedTestCase.index + 1
    if (nextTick < testRunData.testRunCases.length) {
      setSelectedTestCase({
        testCase: testRunData.testRunCases[nextTick],
        index: nextTick,
      })
      handleScroll(nextTick)
    } else {
      setSelectedTestCase({ testCase: testRunData.testRunCases[0], index: 0 })
      handleScroll(0)
    }
  }

  const handleChange = (currentTab) => {
    setTab(currentTab)
    window.location.hash = currentTab === '1' ? 'test-execution' : 'report'
  }

  useEffect(() => {
    if (window.location.href.includes('#report') || isViewer) {
      setTab('2')
    }
  }, [])

  useEffect(() => {
    if (testRunData?.testRunCases) {
      setSelectedTestCase({
        testCase: testRunData?.testRunCases[0],
        index: 0,
      })

      if (!refs) {
        setRefs(
          Array.from({ length: testRunData?.testRunCases?.length }).map(() =>
            React.createRef()
          )
        )
      }
    }
  }, [isLoading, refs])

  useEffect(() => {
    if (testRunData?.testRunCases) {
      const currentTestCase = testRunData?.testRunCases[selectedTestCase.index]
      if (
        JSON.stringify(currentTestCase) !==
        JSON.stringify(selectedTestCase.testCase)
      ) {
        setSelectedTestCase({
          ...selectedTestCase,
          testCase: currentTestCase,
        })
      }
    }
  }, [testRunData])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div>
      <SEO title={'Test Runner'} />
      <PageHeader
        style={{
          marginTop: 0,
          maxWidth: 'calc(100%)',
          whiteSpace: 'nowrap',
          paddingBottom: 0,
          paddingTop: 0,
        }}
        className="site-page-header"
        onBack={() => history.goBack()}
        title={
          <Row
            align="middle"
            gutter={[48, 16]}
            style={{
              width: '100vw',
              maxWidth: 'calc(100%)',
              margin: 0,
              padding: 0,
            }}
          >
            <Col
              span={8}
              style={{
                maxWidth: 'calc(100% / 3)',
                width: 'calc(100% / 3)',
                paddingRight: 50,
                paddingLeft: 5,
              }}
            >
              <EllipsisTooltip title={testRunData?.title}>
                {testRunData?.title}
              </EllipsisTooltip>
            </Col>
            <Col
              span={8}
              style={{
                display: 'flex',
                justifyContent: 'center',
                maxWidth: 'calc(100% / 3)',
                width: 'calc(100% / 3)',
                margin: 0,
                padding: 0,
              }}
            >
              <TestSummary
                key={JSON.stringify(testRunData?.testRunCases)}
                testCases={testRunData?.testRunCases}
              />
            </Col>
            <Col
              span={8}
              style={{
                display: 'flex',
                justifyContent: 'end',
                maxWidth: 'calc(100% / 3)',
                width: 'calc(100% / 3)',
                paddingRight: 0,
              }}
            >
              <div>
                <>
                  {!isViewer ? (
                    <Button
                      onClick={() => handleChange('1')}
                      size="large"
                      disabled={tab === '1'}
                    >
                      Test Execution
                    </Button>
                  ) : null}{' '}
                </>
                <Button
                  onClick={() => handleChange('2')}
                  size="large"
                  disabled={tab === '2'}
                >
                  Summary
                </Button>
              </div>
            </Col>
          </Row>
        }
      ></PageHeader>
      {tab === '1' && !isViewer && (
        <>
          <Progress
            style={{ marginTop: -5, marginBottom: 1 }}
            percent={calculatePercentage(
              testRunData?.testRunCases.length -
              testRunData?.testRunCases.filter(
                (tc) => tc.status === 'not executed'
              ).length,
              testRunData?.testRunCases.length
            )?.toFixed(0)}
            status="active"
            size="small"
            trailColor="#D6DBDF"
          />
          <Row gutter={4}>
            <Col md={8}>
              <TestCaseList
                selectedTestCase={selectedTestCase.testCase}
                setSelectedTestCase={setSelectedTestCase}
                testCases={testRunData?.testRunCases}
                refs={refs}
              />
            </Col>
            <Col md={16}>
              <Row>
                <Col md={12}>
                  <TestCasePreview
                    sections={sections
                      ?.map((sec) => sec?.data)
                      ?.reduce((acc, curr) => {
                        const secs = curr?.sections || []
                        return [...acc, ...secs]
                      }, [])}
                    workspace={workspace}
                    height="calc(100vh - 22.6em)"
                    title={''}
                    testCase={selectedTestCase.testCase}
                    shadow={false}
                    style={{
                      border: 0,
                      borderLeft: 0,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    testCaseTile={() => {
                      const currentTestCase = selectedTestCase?.testCase
                      return (
                        <Space size={0} direction="vertical">
                          <Row align="middle">
                            <StatusTag status={currentTestCase.status} />
                            <ElapsedTime
                              time={currentTestCase?.elapsedTime}
                              status={currentTestCase.status}
                            />
                          </Row>
                          <Title level={5} style={{ marginTop: 3 }}>
                            {`[TC${currentTestCase.customId}] - ${currentTestCase.title}`}
                          </Title>
                        </Space>
                      )
                    }}
                  />
                </Col>
                <Col md={12}>
                  <TestCaseControl
                    workspace={workspace}
                    projectKey={
                      workspace?.projects?.find(
                        (p) => Number(projectId) === Number(p.id)
                      )?.integratedProjectKey
                    }
                    testRunTitle={testRunData?.title}
                    handleComment={(data, action) => {
                      if (action === 'create') {
                        addComment(data)
                          .then((res) => {
                            Notification(
                              'success',
                              'You have successfully added a new comment.',
                              ''
                            )
                          })
                          .catch((error) => {
                            Notification(
                              'error',
                              'Unable to add a comment. Please try again later',
                              ''
                            )
                          })
                      }

                      if (action === 'update') {
                        updateComment(data)
                          .then((res) => {
                            Notification(
                              'success',
                              'You have updated the comment.',
                              ''
                            )
                          })
                          .catch((error) => {
                            Notification(
                              'error',
                              'Unable to update the comment. Please try again later',
                              ''
                            )
                          })
                      }
                    }}
                    selectedTestCase={selectedTestCase}
                    update={(data) => {
                      if (userPersona.test_runner_used === false) {
                        updateUser({
                          ...userPersona,
                          test_runner_used: true,
                        })
                          .then(() => {
                            console.log('update user: test_runner_used')
                          })
                          .catch((error) => {
                            console.log(`update user settings failed: ${error}`)
                          })
                      }
                      let d = {
                        status: data,
                        testRunId: selectedTestCase.testCase.testRunId,
                        testExecutionCycleId: testRunData.test_execution_id,
                      }
                      updateTestRunStatus(d)
                        .then(() => {
                          setSelectedTestCase({
                            testCase: {
                              ...selectedTestCase.testCase,
                              status: d.status,
                            },
                            index: selectedTestCase.index,
                          })
                          Notification(
                            'info',
                            <div
                              style={{
                                marginRight: 5,
                              }}
                            >
                              <span>
                                <b>{`[TC${selectedTestCase.testCase.customId}] ${selectedTestCase.testCase.title} `}</b>
                                {`marked as `}
                              </span>
                              <StatusTag status={data} />
                            </div>
                          )
                        })
                        .catch((error) => {
                          Notification(
                            'error',
                            'Unable to update test status. Please try again later.'
                          )
                        })
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <TestCaseNavigator
            currentIndex={selectedTestCase.index}
            previousTestCase={handlePrevious}
            nextTestCase={handleNext}
          />
        </>
      )}
      {tab === '2' && (
        <ReportSummary testRunId={testRunData.test_execution_id} testRunData={testRunData} />
      )}
    </div>
  )
}

export default TestRunnerPage
