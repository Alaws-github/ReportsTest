import React, { useState } from 'react'
import PageLoader from '../Common/PageLoader'
import PageContentContainer from '../Layout/PageContentContainer'
import { useGetTestRunsByProjectId } from '../../Util/API/TestRuns'
import { useGetReportsByProjectId } from '../../Util/API/Report'
import PrimaryPageHeader from '../Layout/PrimaryPageHeader'
import EmptyReports from './EmptyReports'
import GenerateReportModal from './Modal/GenerateReportModal'
import { useWorkspace } from '../../Context/WorkspaceContext'
import ReportsList from './ReportsList'
import EditReportModal from './Modal/EditReportModal'
import SEO from '../Common/SEO'

function Reports({ match }) {
  const workspace = useWorkspace()
  const customProjectId = match.params.projectId
  const projectId = workspace.getProject(customProjectId)?.id
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const { data: testRunsAndSummaries } = useGetTestRunsByProjectId(projectId)

  const { data: reports, isLoading } = useGetReportsByProjectId(projectId)

  const renderPageContent = () => {
    if (isLoading) {
      return <PageLoader />
    }

    if (reports && reports?.length !== 0) {
      return (
        <ReportsList
          projectId={customProjectId}
          reports={reports}
          loading={isLoading}
          onEdit={(report) => {
            setSelectedReport(report)
            setIsEditModalVisible(true)
          }}
        />
      )
    }

    return (
      <EmptyReports
        loading={isLoading}
        onClick={() => setIsModalVisible(true)}
      />
    )
  }
  return (
    <div>
      <SEO title={'Reports'} />
      <PrimaryPageHeader
        loading={isLoading}
        title="Reports"
        description="Find all your reports here"
        leftButtonLabel="Generate Report"
        onClick={() => setIsModalVisible(true)}
        showForViewer
      />
      <PageContentContainer>{renderPageContent()}</PageContentContainer>
      <GenerateReportModal
        isVisible={isModalVisible}
        setVisible={setIsModalVisible}
        testRunsData={testRunsAndSummaries}
        workspaceId={workspace?.workspaceId}
        projectId={projectId}
      />
      <EditReportModal
        report={selectedReport}
        isVisible={isEditModalVisible}
        setVisible={setIsEditModalVisible}
        workspaceId={workspace?.workspaceId}
        projectId={projectId}
      />
    </div>
  )
}

export default Reports
