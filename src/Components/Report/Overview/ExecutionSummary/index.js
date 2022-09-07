import { Row, Typography, Col } from 'antd'
import StatusDoughnut from './StatusDoughnut'
import { calculatePercentage } from '../../../../Util/util'
import StatusLegend from './StatusLegend'
import Summary from './Summary'
import RCard from '../../RCard'
const { Text } = Typography
const ExecutiveSummary = ({ executionSummaryData }) => {
  return (
    <RCard title={'Execution Summary'}>
      <Row gutter={[8, 8]}>
        <Col
          style={{
            marginTop: '.5rem',
          }}
          span={24}
        >
          <StatusDoughnut
            overview={executionSummaryData?.overview}
            passedPercentage={calculatePercentage(
              executionSummaryData?.overview?.passed,
              executionSummaryData?.overview?.caseCount
            )}
          />
        </Col>
        <Col span={24}>
          <StatusLegend />
        </Col>
        <Col span={24}>
          <Summary stats={executionSummaryData?.overview} />
        </Col>
      </Row>
      <Row justify="end">
        <Text
          style={{
            cursor: 'pointer',
            marginRight: '1em',
          }}
          onClick={() => (window.location.hash = '#suites')}
          underline
        >
          View detailed breakdown
        </Text>
      </Row>
    </RCard>
  )
}

export default ExecutiveSummary
