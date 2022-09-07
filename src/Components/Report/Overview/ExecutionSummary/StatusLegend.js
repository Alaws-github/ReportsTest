import { Row, Col, Avatar, Space, Typography } from 'antd'
import { statusColors } from '../../../../constants'
const StatusLegend = () => {
  const StatusBadge = ({ color, status }) => {
    return (
      <Space wrap={false} direction="horizontal" align="baseline">
        <Avatar shape="square" size={15} style={{ backgroundColor: color }} />
        <Typography.Text>{status}</Typography.Text>
      </Space>
    )
  }
  return (
    <Row align="middle" gutter={[5, 12]}>
      <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
        <StatusBadge color={statusColors.passed} status="Passed" />
      </Col>
      <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
        <StatusBadge color={statusColors.failed} status="Failed" />
      </Col>
      <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
        <StatusBadge color={statusColors.blocked} status="Blocked" />
      </Col>
      <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
        <StatusBadge color={statusColors.skipped} status="Skipped" />
      </Col>
      <Col xs={{ span: 10, offset: 1 }} lg={{ span: 12, offset: 2 }}>
        <StatusBadge color={statusColors.not_executed} status="Not Executed" />
      </Col>
    </Row>
  )
}

export default StatusLegend
