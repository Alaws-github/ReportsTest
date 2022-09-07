import React from 'react'
import { Col, Row } from 'antd'
import Title from 'antd/lib/typography/Title'
import PercentageTotals from './PercentageTotals'
import TestSummary from './TestSummary'
import TestRunsList from './TestRunsList'
import QualityMeter from '../Common/QualityMeter'
import PageLoader from '../Common/PageLoader'
import SEO from '../Common/SEO'
import { useGetTestRunsByProjectId } from '../../Util/API/TestRuns'
import { useGetTestRunQuality } from '../../Util/API/TestRunner'
import { useWorkspace } from '../../Context/WorkspaceContext'

import './style.css'

function Overview({ match }) {
  const customProjectId = match.params.projectId
  const workspace = useWorkspace()
  const projectId = workspace?.getProject(customProjectId)?.id
  const { data: testRunsAndSummaries, isLoading } = useGetTestRunsByProjectId(
    projectId
  )
  const { data: qualityMeter } = useGetTestRunQuality(
    testRunsAndSummaries && testRunsAndSummaries[0]?.id
  )

  const getSummaryTotal = (summaryList) => {
    const summaryTotal = {
      passed: 0,
      failed: 0,
      skipped: 0,
      blocked: 0,
      not_executed: 0,
      case_count: 0,
    }
    summaryList?.forEach((item) => {
      if (!item) return
      summaryTotal.passed += item.summary?.passed
      summaryTotal.failed += item.summary?.failed
      summaryTotal.blocked += item.summary?.blocked
      summaryTotal.skipped += item.summary?.skipped
      summaryTotal.not_executed += item.summary?.not_executed
      summaryTotal.case_count += item.summary?.case_count
    })
    let qualityPercentage = summaryTotal?.passed / summaryTotal?.case_count
    console.log(summaryTotal?.passed)
    console.log(summaryTotal?.case_count)
    return { summaryTotal, qualityPercentage }
  }

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div>
      <SEO title={'Overview'} />
      <div>
        <Title
          style={{
            fontSize: '28px',
          }}
        >
          Overview
        </Title>
      </div>
      <Row gutter={8}>
        <Col flex="auto" md={12}>
          <PercentageTotals
            dataPresent={testRunsAndSummaries}
            summaryTotal={getSummaryTotal(testRunsAndSummaries).summaryTotal}
          />
        </Col>
        <Col flex="auto" md={12}>
          <TestSummary
            summaryTotal={getSummaryTotal(testRunsAndSummaries).summaryTotal}
          />
        </Col>
      </Row>
      <br></br>
      <Row type="flex" gutter={8}>
        <Col flex="auto" md={16}>
          <TestRunsList dataSource={testRunsAndSummaries} />
        </Col>

        <Col flex="auto" md={8}>
          <QualityMeter
            percentAmount={qualityMeter?.qualityScore / 100}
            testRunTitle={qualityMeter?.testRunTitle}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Overview
