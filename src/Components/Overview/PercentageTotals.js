import { Badge, Card, Col, Progress, Row, Space } from 'antd'
import { statusColors } from '../../constants'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
function PercentageTotals({ summaryTotal, dataPresent }) {
  const data = {
    labels: ['Passed', 'Failed', 'Blocked', 'Skipped', 'Not Executed'],
    datasets: [
      {
        data: [
          summaryTotal.passed,
          summaryTotal.failed,
          summaryTotal.blocked,
          summaryTotal.skipped,
          summaryTotal.not_executed,
        ],
        backgroundColor: [
          statusColors.passed,
          statusColors.failed,
          statusColors.blocked,
          statusColors.skipped,
          statusColors.not_executed,
        ],
        hoverOffset: 4,
      },
    ],
  }

  return (
    <Card
      title={
        <div className="custom-header">Percentage totals across all runs</div>
      }
      bodyStyle={{ padding: 10 }}
    >
      <Row>
        <Col flex="auto" md={10}>
          {dataPresent?.length === 0 ? (
            <Row justify="center" style={{ marginTop: 18 }}>
              <Progress
                width={180}
                type="circle"
                strokeWidth={20}
                format={(percent) => (
                  <div style={{ fontSize: 15 }}>No test runs</div>
                )}
              />
            </Row>
          ) : (
            <Doughnut
              width={13}
              options={{
                maintainAspectRatio: false,
                legend: {
                  display: false,
                  labels: {
                    boxWidth: 10,
                  },
                },
              }}
              data={data}
            />
          )}
        </Col>
        <Col flex="auto" md={14}>
          <Space direction="vertical" size="large">
            <Badge
              className="dot"
              color={statusColors.passed}
              text={`${summaryTotal.passed} Total passed test across all runs`}
            />
            <Badge
              className="dot"
              color={statusColors.failed}
              text={`${summaryTotal.failed} Total failed test across all runs`}
            />
            <Badge
              className="dot"
              color={statusColors.blocked}
              text={`${summaryTotal.blocked} Total blocked test across all runs`}
            />
            <Badge
              className="dot"
              size="default"
              color={statusColors.skipped}
              text={`${summaryTotal.skipped} Total skipped test across all runs`}
            />
            <Badge
              className="dot"
              color={statusColors.not_executed}
              text={`${summaryTotal.not_executed} Total not executed test across all runs`}
            />
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default PercentageTotals
