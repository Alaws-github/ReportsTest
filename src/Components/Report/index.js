import React, { useState, useEffect } from 'react'
import PageLoader from '../Common/PageLoader'
import PageContentContainer from '../Layout/PageContentContainer'
import {
  useGetReportById,
  useReportServiceMutation,
} from '../../Util/API/Report'
import { utcToZonedTimeFormat } from '../../Util/util'
import { PageHeader, Tabs, Button, Typography } from 'antd'
import Overview from './Overview'
import Suites from './Suites'
import { FaShare } from 'react-icons/fa'
import { useWorkspace } from '../../Context/WorkspaceContext'
import './style.css'
import ShareOption from './Modal/ShareOption'
import { Notification } from '../Common/Feedback'
import SEO from '../Common/SEO'
const { TabPane } = Tabs
const { Title } = Typography

function Report({ match }) {
  const { generateShareableReport } = useReportServiceMutation()
  const [qualityMeterData, setQualityMeterData] = useState(null)
  const [executionSummaryData, setExecutionSummaryData] = useState(null)
  const [suiteBreakdownData, setSuiteBreakdownData] = useState([])
  const [shareOptionVisible, setShareOptionVisible] = useState(false)
  const [reportLinkId, setReportLinkId] = useState(null)
  const [generatingLink, setGeneratingLink] = useState(false)
  const [tab, setTab] = useState('1')
  const reportId = match.params.id
  const workspace = useWorkspace()

  const { data: reportData, isLoading } = useGetReportById(reportId)

  const handleChange = (currentTab) => {
    setTab(currentTab)
    const tabMapping = {
      1: 'overview',
      2: 'suites',
    }
    window.location.hash = tabMapping[currentTab]
  }

  const renderPageContent = () => {
    if (isLoading) {
      return <PageLoader />
    }

    if (reportData) {
      return (
        <div
          style={{
            paddingRight: '1rem',
            paddingLeft: '1rem',
          }}
          className="card-container"
        >
          <Tabs
            defaultActiveKey={1}
            activeKey={tab}
            onChange={handleChange}
            type="card"
          >
            <TabPane tab={<Title level={4}>Overview</Title>} key={'1'}>
              <Overview
                qualityMeterData={qualityMeterData}
                workspace={workspace}
                executionSummaryData={executionSummaryData}
                suiteBreakdownData={suiteBreakdownData}
              />
            </TabPane>
            <TabPane tab={<Title level={4}>Suites</Title>} key={'2'}>
              <Suites
                suites={suiteBreakdownData}
                overview={executionSummaryData?.overview}
                workspace={workspace}
              />
            </TabPane>
          </Tabs>
        </div>
      )
    }
  }

  const handleGenerateShareableReport = () => {
    setGeneratingLink(true)
    generateShareableReport(reportId)
      .then((response) => {
        setGeneratingLink(false)
        setReportLinkId(response?.id)
        setShareOptionVisible(true)
        Notification(
          'success',
          'You have successfully generated a shareable report link.'
        )
      })
      .catch((error) => {
        setGeneratingLink(false)
        Notification(
          'error',
          'Could not generate shareable link. Please try again later!'
        )
      })
  }

  useEffect(() => {
    if (reportData && reportData?.report_data?.qualityMeter) {
      const {
        qualityMeter,
        executionSummary,
        suiteBreakdown,
      } = reportData?.report_data
      setQualityMeterData(qualityMeter)
      setExecutionSummaryData(executionSummary)
      setSuiteBreakdownData(suiteBreakdown)
    }

    if (reportData && reportData?.sharable_report_id) {
      setReportLinkId(reportData?.sharable_report_id)
    }
  }, [reportData])

  useEffect(() => {
    if (window.location.href.includes('#suites')) {
      setTab('2')
    }
  }, [])

  useEffect(() => {
    window.addEventListener('hashchange', function (e) {
      if (window.location.hash.includes('#suites')) {
        setTab('2')
      }
    })
    return () => window.removeEventListener('hashchange', null)
  }, [])

  return (
    <div>
      <SEO title={`Report - ${tab === '2' ? 'Suites' : 'Overview'}`} />
      <PageHeader
        title={reportData?.name || ''}
        description={utcToZonedTimeFormat(reportData?.created_at)}
        onBack={() => window.history.back()}
        extra={[
          <Button
            size="large"
            style={
              {
                // backgroundColor: '#001528',
                // color: '#fff',
              }
            }
            disabled={true}
          >
            Update Report
          </Button>,
          <Button
            style={{
              backgroundColor: '#2b9dac',
              color: '#fff',
            }}
            size="large"
            icon={
              <FaShare
                style={{
                  marginRight: '0.2rem',
                  fontSize: '.8rem',
                }}
              />
            }
            type="primary"
            disabled={isLoading}
            onClick={() => setShareOptionVisible(true)}
          >
            Share
          </Button>,
        ]}
      />
      <PageContentContainer>{renderPageContent()}</PageContentContainer>
      <ShareOption
        isLoading={generatingLink}
        reportLinkId={reportLinkId}
        reportId={reportId}
        setVisible={setShareOptionVisible}
        isVisible={shareOptionVisible}
        handleGenerateShareableReport={() =>
          handleGenerateShareableReport(reportId)
        }
      />
    </div>
  )
}

export default Report
