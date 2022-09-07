import React, { useState, useEffect } from 'react'
import PageLoader from '../Common/PageLoader'
import PageContentContainer from '../Layout/PageContentContainer'
import { PageHeader, Tabs, Typography, Button, Empty } from 'antd'
import { utcToZonedTimeFormat } from '../../Util/util'
import Overview from '../Report/Overview'
import Suites from '../Report/Suites'
import { useHistory } from 'react-router-dom'
import { useWorkspace } from '../../Context/WorkspaceContext'

import { useGetShareableReportById } from '../../Util/API/Report'
import StandaloneLayout from '../Layout/StandaloneLayout'
import SEO from '../Common/SEO'
import './style.css'
const { Title, Text } = Typography
const { TabPane } = Tabs
const PublicReport = ({ match }) => {
  const history = useHistory()
  const workspace = useWorkspace()
  const reportId = match?.params?.id?.substring(1)
  const [tab, setTab] = useState('1')
  const [qualityMeterData, setQualityMeterData] = useState(null)
  const [executionSummaryData, setExecutionSummaryData] = useState(null)
  const [suiteBreakdownData, setSuiteBreakdownData] = useState(null)

  const { data: reportData, isLoading } = useGetShareableReportById(reportId)

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
            <TabPane tab={<Title level={4}>Overview</Title>} key="1">
              <Overview
                workspace={workspace}
                executionSummaryData={executionSummaryData}
                suiteBreakdownData={suiteBreakdownData}
                qualityMeterData={qualityMeterData}
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
          ,
        </div>
      )
    } else {
      return (
        <Empty
          image="/image/404.svg"
          imageStyle={{
            height: 350,
          }}
          description={
            <div>
              <Text type="secondary">
                Sorry, the page you visited does not exist.
              </Text>
            </div>
          }
        >
          <Button onClick={() => history.push('/')} type="primary">
            Back to Home
          </Button>
        </Empty>
      )
    }
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
      <SEO
        title={'Shareable Report'}
        description={`
          Report name: ${reportData?.name || ''}
          Quality score: ${reportData?.report_data?.qualityMeter?.qualityScore || ''
          }
          Total tests: ${reportData?.report_data?.executionSummary?.count || ''}
          Total passed: ${reportData?.report_data?.executionSummary?.passed || ''
          }
          Total failed: ${reportData?.report_data?.executionSummary?.failed || ''
          }
          Total skipped: ${reportData?.report_data?.executionSummary?.skipped || ''
          }
          
          ----
          Created on: ${utcToZonedTimeFormat(reportData?.created_at)}
      `}
      />
      <StandaloneLayout>
        <PageHeader
          title={reportData?.name || ''}
          subTitle={utcToZonedTimeFormat(reportData?.created_at)}
        />
        <PageContentContainer>{renderPageContent()}</PageContentContainer>
      </StandaloneLayout>
    </div>
  )
}

export default PublicReport
