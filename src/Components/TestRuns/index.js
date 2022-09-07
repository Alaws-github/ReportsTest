import React, { useState, useEffect } from 'react'
import PageLoader from '../Common/PageLoader'
import PageContentContainer from '../Layout/PageContentContainer'
import PrimaryPageHeader from '../Layout/PrimaryPageHeader'
import {
  useGetTestRunsByProjectId,
  useGetTestSuiteWithCases,
  useGetSectionsForSuites,
} from '../../Util/API/TestRuns'
import { GetTestRunData } from '../../Util/API/TestRunner'
import { useGetTestSuiteByProjectId } from '../../Util/API/TestSuites'
import TestRunList from './TestRunList'
import EmptyTestRun from './EmptyTestRun'
import NewTestRunModal from './Modal/NewTestRun'
import SEO from '../Common/SEO'
import { useWorkspace } from '../../Context/WorkspaceContext'

function TestRunsPage({ match }) {
  const workspace = useWorkspace()
  const customProjectId = match?.params?.projectId
  const projectId = workspace?.getProject(customProjectId)?.id;
  const { data: testRunsAndSummaries, isLoading } = useGetTestRunsByProjectId(
    projectId
  )
  const { data: testSuiteList } = useGetTestSuiteByProjectId(projectId)

  const testSuiteWithCases = useGetTestSuiteWithCases(testSuiteList)
  const sections = useGetSectionsForSuites(testSuiteList)

  const [showModal, setShowModal] = useState(false)
  const [testSuitesWithCasesList, setTestSuiteWithCasesList] = useState([])
  const [testRunDetails, setTestRunDetails] = useState({})
  const [modalType, setModalType] = useState('')
  const [currentTestRun, setCurrentTestRun] = useState(null)

  const { data: testRunData } = GetTestRunData({ customExecutionId: currentTestRun, projectId })

  const handleShowModal = () => {
    setModalType('create')
    setShowModal(!showModal)
  }

  const onEdit = (data) => {
    setModalType('edit')
    setTestRunDetails(data)
    setCurrentTestRun(data.customId)
    setShowModal(true)
  }

  const getExistingTestCases = () => {
    return modalType === 'edit'
      ? testRunData?.testRunCases?.map((tc) => {
        return {
          id: tc.testCaseId,
          testSuiteId: tc.suiteId,
          testCaseId: tc.testCaseId,
        }
      })
      : []
  }
  const renderPageContent = () => {
    if (isLoading) {
      return <PageLoader />
    }

    if (testRunsAndSummaries && testRunsAndSummaries.length !== 0) {
      return (
        <TestRunList
          loading={isLoading}
          onEdit={onEdit}
          dataSource={testRunsAndSummaries}
        />
      )
    }

    return <EmptyTestRun onClick={handleShowModal} />
  }

  useEffect(() => {
    if (testSuiteWithCases && sections) {
      // TODO: Have the API return the data how we want it
      const finalData = testSuiteWithCases?.map((trs) => trs.data)
      const finalSectionData = sections?.map((sec) => sec.data)
      if (finalSectionData?.length === sections?.length) {
        const updateFinalData = finalData.map((trs) => {
          const suiteSections =
            finalSectionData?.find((sec) => sec?.testSuiteId === trs?.id)
              ?.sections || []
          const testCases = trs?.children || []
          const sectionsAndCases =
            suiteSections?.length > 0
              ? [...suiteSections, ...testCases]
                .map((data) => {
                  if (data?.type === 'section') {
                    const children = testCases.filter(
                      (tc) => tc.section === data.id
                    )
                    if (children.length > 0) {
                      data['children'] = children
                    }
                  }
                  return data
                })
                .filter((data) => !data?.section)
              : []
          if (trs && sectionsAndCases?.length > 0)
            trs['children'] = [...new Set(sectionsAndCases)]
          return trs
        })
        if (
          JSON.stringify(updateFinalData) !==
          JSON.stringify(testSuitesWithCasesList)
        )
          setTestSuiteWithCasesList(updateFinalData)
      }
    }
  }, [testSuiteWithCases, sections])

  return (
    <div>
      <SEO title='Test Runs' />
      <PrimaryPageHeader
        loading={isLoading}
        title="Test Runs"
        description="Find all your test runs here"
        leftButtonLabel="New Test Run"
        onClick={() => {
          setTestRunDetails({})
          setCurrentTestRun(null)
          setModalType('create')
          handleShowModal()
        }}
      />
      <PageContentContainer>{renderPageContent()}</PageContentContainer>
      <NewTestRunModal
        workspace={workspace}
        testCases={testSuitesWithCasesList}
        sections={sections
          ?.map((sec) => sec?.data)
          ?.reduce((acc, curr) => {
            const secs = curr?.sections || []
            return [...acc, ...secs]
          }, [])}
        onCancel={() => {
          setShowModal(false)
          setModalType('')
          setTestRunDetails({})
          setCurrentTestRun(null)
        }}
        visible={showModal}
        projectId={projectId}
        modalType={modalType}
        savedTestRunDetails={testRunDetails}
        existingTestCases={getExistingTestCases()}
      />
    </div>
  )
}

export default TestRunsPage
