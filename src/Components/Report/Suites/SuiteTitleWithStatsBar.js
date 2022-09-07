import { Row, Col, Tag, Tooltip, Grid } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import MultiProgress from 'react-multi-progress'
import { statusColors } from '../../../constants'
import { calculateSummaryPercentages } from '../../../Util/util'
import EllipsisTooltip from '../../Common/EllipsisTooltip'
const { useBreakpoint } = Grid
const SuiteTitleWithStatsBar = ({
  suite,
  showIsHighPriorityFailedText = true,
}) => {
  const { xs } = useBreakpoint()
  const percentages = calculateSummaryPercentages({
    ...suite?.overview,
    completed: suite?.overview?.caseCount - suite?.overview?.notExecuted,
    not_executed: suite?.overview?.notExecuted,
    case_count: suite?.overview?.caseCount,
  })
  return (
    <Row
      style={{
        width: '100%',
      }}
      align="middle"
    >
      <Col xs={{ span: 5 }} lg={{ span: 6 }}>
        <EllipsisTooltip title={suite?.suiteTitle}>
          {suite?.suiteTitle}
        </EllipsisTooltip>
      </Col>

      <Col
        xs={showIsHighPriorityFailedText === false ? { span: 1 } : { span: 5 }}
        lg={showIsHighPriorityFailedText === false ? { span: 1 } : { span: 6 }}
      >
        {suite?.isHighPriorityFailed && (
          <span>
            <Tooltip title="High-priority failed test case/s can be found in this suite.">
              <ExclamationCircleOutlined
                style={{
                  color: '#08979c',
                  marginRight: '5px',
                }}
              />
            </Tooltip>

            {showIsHighPriorityFailedText && !xs && (
              <Tag color="cyan">High priority</Tag>
            )}
          </span>
        )}
      </Col>

      <Col
        xs={
          showIsHighPriorityFailedText === false ? { span: 19 } : { span: 14 }
        }
        lg={
          showIsHighPriorityFailedText === false ? { span: 17 } : { span: 12 }
        }
      >
        <Tooltip
          title={`${suite?.overview?.passed} passed / ${suite?.overview?.failed} failed / ${suite?.overview?.blocked}  blocked / ${suite?.overview?.skipped} skipped / ${suite?.overview?.notExecuted} not executed`}
        >
          <Row wrap={false} align="middle">
            <MultiProgress
              backgroundColor={'#EAF2F8'}
              height={11}
              elements={[
                {
                  value: percentages.passed,
                  color: statusColors.passed,
                },
                {
                  value: percentages.failed,
                  color: statusColors.failed,
                },
                {
                  value: percentages.blocked,
                  color: statusColors.blocked,
                },
                {
                  value: percentages.skipped,
                  color: statusColors.skipped,
                },
                {
                  value: percentages.not_executed,
                  color: statusColors.not_executed,
                },
              ]}
            />
          </Row>
        </Tooltip>
      </Col>
    </Row>
  )
}

export default SuiteTitleWithStatsBar
