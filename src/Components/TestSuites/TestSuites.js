import React, { useState } from 'react'
import NewTestSuiteModal from './Modals/NewTestSuiteModal'
import PageLoader from '../Common/PageLoader'
import PageContentContainer from '../Layout/PageContentContainer'
import {
  useGetSuiteTemplateList,
  useGetTestSuiteByProjectId,
} from '../../Util/API/TestSuites'

import TestSuiteList from './TestSuitesList'
import EmptyTestSuite from './EmptyTestSuite'
import EditTestSuite from './Modals/EditTestSuite'
import PrimaryPageHeader from '../Layout/PrimaryPageHeader'
import './style.less'
import ImportTestSuiteModal from './Modals/ImportTestSuiteModal'
import SEO from '../Common/SEO'
import { useWorkspace } from '../../Context/WorkspaceContext'

function TestSuites({ match }) {
  const workspace = useWorkspace();
  const projectId = workspace?.getProject(match?.params?.projectId)?.id;
  const [showTestSuiteModal, setShowTestSuiteModal] = useState(false)
  const [showImportTestSuiteModal, setShowImportTestSuiteModal] = useState(
    false
  )
  const [showEditTestSuiteModal, setShowEditTestSuiteModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const { data: listOfTemplates } = useGetSuiteTemplateList()

  const { data: listOfTestSites, isLoading } = useGetTestSuiteByProjectId(
    projectId
  )
  const showModal = () => {
    setShowTestSuiteModal(true)
  }
  const renderPageContent = () => {
    if (isLoading) {
      return <PageLoader />
    }
    if (listOfTestSites && listOfTestSites.length !== 0) {
      return (
        <TestSuiteList
          setShowEditTestSuiteModal={setShowEditTestSuiteModal}
          setSelectedRow={setSelectedRow}
          onClick={showModal}
          dataSource={listOfTestSites}
        />
      )
    }
    return <EmptyTestSuite loading={isLoading} onClick={showModal} />
  }
  return (
    <div>
      <SEO title={'Test Suites'} />
      <PrimaryPageHeader
        loading={isLoading}
        title="Test Suites"
        description="Find all your test suites here"
        leftButtonLabel="New Test Suite"
        onClick={() => {
          setShowTestSuiteModal(true)
        }}
        secondaryButtonLabel="Import Test Suite"
        secondaryOnClick={() => {
          setShowImportTestSuiteModal(true)
        }}
      />
      <PageContentContainer>{renderPageContent()}</PageContentContainer>
      <NewTestSuiteModal
        visible={showTestSuiteModal}
        templates={listOfTemplates}
        onCancel={() => {
          setShowTestSuiteModal(false)
        }}
        projectId={projectId}
      />
      <ImportTestSuiteModal
        visible={showImportTestSuiteModal}
        onCancel={() => {
          setShowImportTestSuiteModal(false)
        }}
        projectId={projectId}
      />
      <EditTestSuite
        visible={showEditTestSuiteModal}
        onSuccess={() => setShowEditTestSuiteModal(false)}
        loading={false}
        record={selectedRow}
        onCancel={() => {
          setShowEditTestSuiteModal(false)
        }}
      />
    </div>
  )
}

export default TestSuites
