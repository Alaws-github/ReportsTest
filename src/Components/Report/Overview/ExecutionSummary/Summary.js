import { Typography, Space, Row, Col } from 'antd'
import { statusColors } from '../../../../constants'
const { Title, Text } = Typography
const Summary = ({ stats }) => {
  const StatusCount = ({ title, count, color }) => {
    return (
      <Row align="middle">
        <Col flex={'auto'} sm={24}>
          <Text
            style={{
              color,
              fontWeight: 'bold',
              fontSize: '1.5rem',
              marginLeft: '2rem',
            }}
          >
            {count}
          </Text>
        </Col>
        <Col flex={'auto'} sm={24}>
          <Text
            style={{
              marginLeft: '2rem',
              fontSize: '.9rem',
            }}
            level={4}
          >
            {title}
          </Text>
        </Col>
      </Row>
    )
  }
  return (
    <div
      style={{
        marginTop: '.5rem',
        padding: '0px 20px',
        width: '100%',
      }}
    >
      <Title
        style={{
          borderBottom: '1px solid #e8e8e8',
        }}
        level={3}
      >
        Summary
      </Title>

      <Space
        style={{
          width: '100%',
        }}
        direction="vertical"
      >
        <StatusCount
          title="Test Cases Executed"
          count={stats?.caseCount - stats?.notExecuted}
        />
        <StatusCount
          title="Test Cases Passed"
          count={stats?.passed}
          color={statusColors.passed}
        />
        <StatusCount
          title="Test Cases Failed"
          count={stats?.failed}
          color={statusColors.failed}
        />
        <StatusCount
          title="Test Cases Blocked"
          count={stats?.blocked}
          color={statusColors.blocked}
        />
        <StatusCount
          title="Test Cases Skipped"
          count={stats?.skipped}
          color={statusColors.skipped}
        />
      </Space>
    </div>
  )
}

export default Summary
