import { Card, Col, Progress, Row, Space } from 'antd'
import Text from 'antd/lib/typography/Text'
import React from 'react'
import { statusColors } from '../../constants'

function TestSummary({ summaryTotal }) {
  const StatusProgress = ({ color, count, status }) => (
    <Progress
      strokeColor={color}
      strokeWidth={8}
      width={150}
      type="circle"
      percent={100}
      format={() => {
        return (
          <div>
            <Space direction="vertical" size={-7}>
              <Text style={{ fontSize: 25 }}>{count}</Text>
              <Text style={{ fontSize: 15 }}>{status}</Text>
            </Space>
          </div>
        )
      }}
    />
  )
  return (
    <Card
      style={{ height: '100%' }}
      title={<div className="custom-header">Totals across all test runs</div>}
    >
      <Row justify="center" gutter={[32, 16]}>
        <Col>
          <StatusProgress
            color={statusColors.passed}
            count={summaryTotal.passed}
            status="Passed"
          />
        </Col>
        <Col>
          <StatusProgress
            color={statusColors.failed}
            count={summaryTotal.failed}
            status="Failed"
          />

        </Col>
        <Col>
          <StatusProgress
            color={statusColors.not_executed}
            count={summaryTotal.not_executed}
            status="Not Executed"
          />
        </Col>

      </Row>
    </Card>
  )
}

export default TestSummary
