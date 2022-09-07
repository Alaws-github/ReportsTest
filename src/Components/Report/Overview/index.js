import { Row, Col } from 'antd'
import QualityMeter from './QualityMeter'
import ExecutiveSummary from './ExecutionSummary'
import Suites from './Suites'
const Overview = ({
  qualityMeterData,
  executionSummaryData,
  workspace,
  suiteBreakdownData,
}) => {

  return (
    <Row type="flex" gutter={[8, 8]}>
      <Col flex="auto" md={12} lg={7}>
        <QualityMeter
          highPriorityFailedTestCases={
            qualityMeterData?.highPriorityFailedTestCases
          }
          qualityScore={qualityMeterData?.qualityScore / 100}
          workspace={workspace}
        />
      </Col>
      <Col flex="auto" md={12} lg={7}>
        <ExecutiveSummary
          executionSummaryData={executionSummaryData}
          workspace={workspace}
        />
      </Col>
      <Col flex="auto" md={24} lg={10}>
        <Suites suites={suiteBreakdownData} />
      </Col>
    </Row>
  )
}

export default Overview
