import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Typography, Col, PageHeader, Row, Button, Affix, Tooltip } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import {
  useGetTestCaseList,
  useTestCasesMutation,
  useGetSectionList,
} from '../../Util/API/TestCases'
import { useAIServiceMutation } from '../../Util/API/AI'
import PageLoader from '../Common/PageLoader'
import TestCaseEditor from './TestCaseEditor'
import NewTestCase from './Modal/NewTestCase'
import { useAuth } from '../../Context/AuthContext'
import { Notification } from '../Common/Feedback'
import TestCaseList from './TestCaseList/index'
import EmptyTestCase from './EmptyTestCase'
import GenerateTestCase from './Modal/GenerateTestCase'
import NewSection from './Modal/NewSection'
import SEO from '../Common/SEO'
import { useWorkspace } from '../../Context/WorkspaceContext'
import './styles.css'
const { Title } = Typography
function TestCases(props) {
  const workspace = useWorkspace()
  const { generateTestCase } = useAIServiceMutation()
  const customSuiteId = props.match.params.id
  const customProjectId = props?.match?.params?.projectId
  const projectId = workspace.getProject(customProjectId)?.id
  let history = useHistory()
  let location = useLocation()
  let [searchParams, setSearchParams] = useState('')
  const { data, isLoading } = useGetTestCaseList({ customSuiteId, projectId })

  const { data: sectionsData } = useGetSectionList({ customSuiteId, projectId })

  const {
    createTestCase,
    updateTestCase,
    deleteTestCase,
    createSection,
    updateSection,
    deleteSection,
  } = useTestCasesMutation()

  const { testCases, categories, testSuiteInfo } = data || {
    testCases: [],
    sections: [],
    categories: [],
  }
  const [selectedTestCases, setSelectedTestCases] = useState([])
  const [showNewTestCase, setShowNewTestCase] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentTestCase, setCurrentTestCase] = useState(null)
  const { currentUser } = useAuth()
  const [edit, setEdit] = useState(false)
  const [showGenerateTestCase, setShowGenerateTestCase] = useState(false)
  const [showNewSection, setShowNewSection] = useState(false)
  const [generatedTestCases, setGeneratedTestCases] = useState([])
  const [generating, setGenerating] = useState(false)
  const [creatingTestCase, setCreatingTestCase] = useState(false)
  const [currentSection, setCurrentSection] = useState(null)
  const [filters, setFilters] = useState([])
  const [tc, setTC] = useState(testCases)
  // TODO: Update with suiteId
  const suiteId = testSuiteInfo?.id
  const references = [
    ...new Set(
      testCases
        ?.filter((tc) => tc?.referenceKey)
        .map((tc) => tc?.referenceKey) || []
    ),
  ]

  const options = [
    {
      value: 'section',
      label: 'Section',
      children: sectionsData?.map((section) => {
        return {
          value: section?.id,
          label: section?.name,
        }
      }),
    },
    {
      value: 'priority',
      label: 'Priority',
      children: [
        {
          value: 'P1',
          label: 'P1',
        },
        {
          value: 'P2',
          label: 'P2',
        },
        {
          value: 'P3',
          label: 'P3',
        },
        {
          value: 'P4',
          label: 'P4',
        },
      ],
    },
    {
      value: 'reference',
      label: 'Reference',
      children: references?.map((referenceKey) => {
        return {
          value: referenceKey,
          label: referenceKey,
        }
      }),
    },
  ]

  const closeRightPanel = () => {
    return (
      <Tooltip title="Close">
        <CloseCircleOutlined
          style={{ color: 'red' }}
          onClick={() => {
            setEdit(false)
            setCurrentTestCase()
          }}
        />
      </Tooltip>
    )
  }

  const getTestCasesWithSection = (cases, isFilter = false) => {
    const caseSections = [
      ...new Set(
        cases?.filter((tc) => tc.section).map((tc) => tc.section) || []
      ),
    ]

    const sections = sectionsData?.filter((section) =>
      caseSections?.includes(section.id)
    )

    const sectionDataToUse = isFilter ? sections : sectionsData

    const testCaseData =
      sectionDataToUse?.length > 0
        ? [...sectionDataToUse, ...cases]
          .map((data) => {
            const copy = JSON.parse(JSON.stringify(data))
            if (copy?.type === 'section') {
              const children = cases.filter((tc) => tc.section === copy.id)
              if (children.length > 0) {
                copy['children'] = children
              }
            }
            return copy
          })
          .filter((data) => !data?.section)
        : cases
    return sectionDataToUse?.length === 0 && testCaseData?.length === 0
      ? []
      : testCaseData
  }

  const checkIsFilter = (possibleFilters) => {
    let isFilter =
      (possibleFilters?.reference && possibleFilters?.reference?.length > 0) ||
      (possibleFilters?.priority && possibleFilters?.priority?.length > 0) ||
      (possibleFilters?.section && possibleFilters?.section?.length > 0) ||
      (possibleFilters?.search && possibleFilters?.search !== '') ||
      false
    return isFilter
  }

  const handleFilters = (newFilters) => {
    let cases = testCases

    if (newFilters?.search) {
      cases = testCases.filter((testCase) =>
        testCase?.title
          ?.toLowerCase()
          ?.includes(newFilters?.search?.toLowerCase())
      )
    }

    if (newFilters?.section?.length > 0) {
      cases = cases.filter((testCase) =>
        newFilters?.section?.includes(testCase?.section)
      )
    }

    if (newFilters?.priority?.length > 0) {
      cases = cases.filter((testCase) =>
        newFilters?.priority?.includes(testCase?.priority)
      )
    }

    if (newFilters?.reference?.length > 0) {
      cases = cases.filter((testCase) =>
        newFilters?.reference?.includes(testCase?.referenceKey)
      )
    }

    let isFilter = checkIsFilter(newFilters)

    cases = JSON.parse(JSON.stringify(getTestCasesWithSection(cases, isFilter)))

    if (JSON.stringify(cases) !== JSON.stringify(tc)) setTC(cases)

    setFilters(newFilters)
    setSearchParams(
      isFilter
        ? Buffer.from(JSON.stringify(newFilters)).toString('base64')
        : 'remove-filters'
    )
  }

  const handleOnFilterChange = (value, label) => {
    const _filters = { ...filters, [label]: value }
    handleFilters(_filters)
  }

  const handleOnSearch = (value) => {
    const _filters = { ...filters, search: value }
    handleFilters(_filters)
  }

  const getFilterQueryString = () => {
    const query = new URLSearchParams(location.search)
    const filterParams = query.get('filter')
    let queryFilters = null
    if (filterParams) {
      try {
        queryFilters = JSON.parse(
          Buffer.from(filterParams, 'base64').toString()
        )
      } catch (error) {
        history.push({ search: '' })
      }
    }
    return queryFilters
  }

  useEffect(() => {
    const params = new URLSearchParams()
    try {
      if (searchParams) {
        params.append('filter', searchParams)
        history.push({ search: params.toString() })
      }

      if (searchParams === 'remove-filters') {
        history.push({ search: '' })
      }
    } catch (error) {
      history.push({ search: '' })
    }
  }, [searchParams])

  useEffect(() => {
    const queryFilters = getFilterQueryString()
    const isFilter = checkIsFilter(queryFilters)

    const testCasesWithSection = getTestCasesWithSection(testCases)

    if (JSON.stringify(testCasesWithSection) !== JSON.stringify(tc))
      setTC(testCasesWithSection)

    if (isFilter && testCases?.length && sectionsData?.length) {
      handleFilters(queryFilters)
    }
  }, [testCases, sectionsData])

  if (isLoading) {
    return <PageLoader />
  }

  if (sectionsData?.length === 0 && testCases?.length === 0) {
    return (
      <>
        {' '}
        <EmptyTestCase
          onClick={() => {
            setShowNewTestCase(true)
          }}
        />
        <NewTestCase
          workspace={workspace}
          loading={loading}
          visible={showNewTestCase}
          data={[]}
          onCreate={(data) => {
            setLoading(true)
            let a = {
              suiteId: suiteId,
              author: currentUser.attributes.sub,
              ...data,
            }
            createTestCase(a)
              .then(() => {
                Notification(
                  'success',
                  `You have successfully added a new test case.`
                )
                setShowNewTestCase(false)
                setLoading(false)
              })
              .catch((error) => {
                Notification(
                  'error',
                  'Unable to add test case. Please try again later.'
                )
                setLoading(false)
              })
          }}
          onCancel={() => {
            setShowNewTestCase(false)
          }}
        />
      </>
    )
  }

  return (
    <div>
      <SEO title={'Test Cases'} />
      <PageHeader
        className="site-page-header"
        onBack={() => history.push(`/${customProjectId}/test-suites`)}
        title="Test Cases"
      />

      <Row gutter={[8, 8]}>
        <Col md={currentTestCase ? 16 : 24}>
          <TestCaseList
            testSuiteInfo={testSuiteInfo}
            numberOfTests={testCases?.length}
            loading={loading}
            testCases={tc}
            setTestCases={setTC}
            setShowNewTestCase={setShowNewTestCase}
            setLoading={setLoading}
            selectedTestCases={selectedTestCases}
            setCurrentSection={setCurrentSection}
            setCurrentTestCase={setCurrentTestCase}
            setSelectedTestCases={setSelectedTestCases}
            currentTestCase={currentTestCase}
            deleteTestCase={(data) => {
              setLoading(true)

              deleteTestCase(data)
                .then(() => {
                  if (data?.testCaseIds?.includes(currentTestCase?.id)) {
                    setCurrentTestCase(null)
                  }

                  if (setSelectedTestCases?.length > 0) {
                    setSelectedTestCases([])
                  }

                  setLoading(false)
                  Notification('success', 'Your test case was deleted.')
                })
                .catch((error) => {
                  setLoading(false)
                  Notification(
                    'error',
                    'Unable to delete test case. Please try again later.'
                  )
                })
            }}
            setShowGenerateTestCase={setShowGenerateTestCase}
            isViewer={workspace?.isViewer}
            setShowNewSection={setShowNewSection}
            triggerSectionTestCase={(section) => {
              setCurrentSection(section)
              setShowNewTestCase(true)
            }}
            triggerSectionUpdate={(section) => {
              setCurrentSection(section)
              setShowNewSection(true)
            }}
            deleteSection={(sectionId) => {
              setLoading(true)
              deleteSection({ sectionId })
                .then(() => {
                  setLoading(false)
                  Notification('success', 'Your section was deleted.')
                })
                .catch((error) => {
                  setLoading(false)
                  Notification(
                    'error',
                    'Unable to delete section. Please try again later.'
                  )
                })
            }}
            duplicateTestCase={(testCase) => {
              setLoading(true)
              let tc = {
                ...testCase,
                suiteId: suiteId,
                author: currentUser.attributes.sub,
                title: `${testCase.title} (copy)`,
              }
              createTestCase(tc)
                .then(() => {
                  Notification(
                    'success',
                    `You have successfully duplicated test case.`
                  )
                  setShowNewTestCase(false)
                  setLoading(false)
                })
                .catch((error) => {
                  Notification(
                    'error',
                    'Unable to duplicate test case. Please try again later.'
                  )
                  setLoading(false)
                })
            }}
            options={options}
            onSearch={handleOnSearch}
            onFilterChange={handleOnFilterChange}
            filters={filters}
          />
        </Col>
        <Col md={currentTestCase ? 8 : 0}>
          <Affix>
            <TestCaseEditor
              sections={sectionsData}
              workspace={workspace}
              loading={loading}
              testCase={currentTestCase}
              categories={categories}
              editMode={edit}
              saveUpdatedTestCase={(data) => {
                setLoading(true)
                if (!data?.referenceKey) {
                  data.referenceUrl = ''
                }
                let a = {
                  id: currentTestCase.id,
                  suiteId: suiteId,
                  author: currentUser.attributes.sub,
                  ...data,
                }
                updateTestCase(a)
                  .then(() => {
                    Notification('success', `Your test case was updated.`)
                    setCurrentTestCase(a)
                    setLoading(false)
                    setEdit(false)
                  })
                  .catch((error) => {
                    setLoading(false)
                    Notification(
                      'error',
                      'Unable to update test case. Please try again later.'
                    )
                  })
              }}
              title={
                <>
                  {edit ? (
                    <Row justify="space-between" align="middle">
                      <Col md={12}>
                        <Title level={5} style={{ marginTop: 2 }}>
                          {closeRightPanel()} Edit
                        </Title>
                      </Col>
                      <Col md={12}>
                        <Row justify="end">
                          <Button
                            onClick={() => {
                              setEdit(false)
                            }}
                            type="ghost"
                          >
                            Cancel
                          </Button>
                        </Row>
                      </Col>
                    </Row>
                  ) : (
                    <Row justify="space-between" align="middle">
                      <Col md={12}>
                        <Title level={5} style={{ marginTop: 2 }}>
                          {closeRightPanel()} Preview
                        </Title>
                      </Col>
                      {!workspace?.isViewer && (
                        <Col md={12}>
                          <Row justify="end">
                            <Button
                              onClick={() => {
                                setEdit(true)
                              }}
                              type="primary"
                            >
                              Edit
                            </Button>
                          </Row>
                        </Col>
                      )}
                    </Row>
                  )}
                </>
              }
              height="calc(100vh - 21.2em)"
            />
          </Affix>
        </Col>
      </Row>
      <NewTestCase
        currentSection={currentSection}
        workspace={workspace}
        loading={loading}
        visible={showNewTestCase}
        data={[]}
        onCreate={(data) => {
          setLoading(true)
          let a = {
            suiteId: suiteId,
            author: currentUser.attributes.sub,
            ...data,
          }
          createTestCase(a)
            .then(() => {
              Notification(
                'success',
                `You have successfully added a new test case.`
              )
              setShowNewTestCase(false)
              setLoading(false)
            })
            .catch((error) => {
              Notification(
                'error',
                'Unable to add test case. Please try again later.'
              )
              setLoading(false)
            })
        }}
        onCancel={() => {
          setShowNewTestCase(false)
        }}
        sections={sectionsData}
      />
      <GenerateTestCase
        loading={generating}
        data={generatedTestCases}
        visible={showGenerateTestCase}
        creatingTestCase={creatingTestCase}
        onCreate={(testCaseData) => {
          setCreatingTestCase(true)
          let a = {
            suiteId: suiteId,
            author: currentUser.attributes.sub,
            title: testCaseData.item.title,
          }
          createTestCase(a)
            .then(() => {
              Notification(
                'success',
                `You have successfully added a new test case.`
              )
              generatedTestCases[testCaseData.index].added = true
              setGeneratedTestCases([...generatedTestCases])
              setCreatingTestCase(false)
            })
            .catch((error) => {
              Notification(
                'error',
                'Unable to add test case. Please try again later.'
              )
              setCreatingTestCase(false)
            })
        }}
        getTestCases={(requirement) => {
          // make call to GPT-3
          setGenerating(true)
          generateTestCase(requirement)
            .then((testCases) => {
              setGeneratedTestCases(testCases)
              setGenerating(false)
            })
            .catch((error) => {
              Notification(
                'error',
                error?.response?.data
                  ? 'The test cases generated have sensitive content. Please provide a new user story.'
                  : 'Unable to auto generate test cases. Please try again later!',
                'Unable to auto generate test cases.'
              )
              setGenerating(false)
            })
        }}
        onCancel={() => setShowGenerateTestCase(false)}
      />
      <NewSection
        visible={showNewSection}
        onCancel={() => setShowNewSection(false)}
        currentSection={currentSection}
        onCreate={({ name }) => {
          setLoading(true)
          if (currentSection) {
            updateSection({ sectionId: currentSection?.id, name })
              .then(() => {
                Notification(
                  'success',
                  `You have successfully updated a section.`
                )
                setShowNewSection(false)
                setLoading(false)
              })
              .catch((error) => {
                Notification(
                  'error',
                  'Unable to update section. Please try again later.'
                )
                setLoading(false)
              })
          } else {
            createSection({ name, suite_id: suiteId })
              .then(() => {
                Notification(
                  'success',
                  `You have successfully added a new section.`
                )
                setShowNewSection(false)

                setLoading(false)
              })
              .catch((error) => {
                Notification(
                  'error',
                  'Unable to add new section. Please try again later.'
                )
                setLoading(false)
              })
          }
          setCurrentSection(null)
        }}
        loading={loading}
      />
    </div>
  )
}

export default TestCases
