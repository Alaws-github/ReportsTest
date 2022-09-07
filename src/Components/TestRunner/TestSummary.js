import { Row, Space } from 'antd'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import React, { useState, useEffect } from 'react'
import { statusColors } from '../../constants'

function TestSummary({ testCases }) {
  useEffect(() => {
    setSummary({
      passed: testCases?.filter(({ status }) => status === 'passed').length,
      failed: testCases?.filter(({ status }) => status === 'failed').length,
      blocked: testCases?.filter(({ status }) => status === 'blocked').length,
      not_executed: testCases?.filter(({ status }) => status === 'not executed')
        .length,
      skipped: testCases?.filter(({ status }) => status === 'skipped').length,
    })
  }, [testCases])

  const [summary, setSummary] = useState({
    passed: 0,
    failed: 0,
    blocked: 0,
    skipped: 0,
    not_executed: 0,
  })

  const StatusCount = ({ name, count, color }) => (
    <Space size={1} align="center" direction="vertical">
      <Text style={{ color, fontSize: 25 }}>{count}</Text>
      <Title
        style={{
          whiteSpace: 'nowrap',
        }}
        type="secondary"
        level={5}
      >
        {name}
      </Title>
    </Space>
  )

  return (
    <Row justify="center">
      <Space size={80}>
        <StatusCount
          color={statusColors.passed}
          name="Passed"
          count={summary.passed}
        />
        <StatusCount
          color={statusColors.failed}
          name="Failed"
          count={summary.failed}
        />
        <StatusCount
          color={statusColors.blocked}
          name="Blocked"
          count={summary.blocked}
        />
        <StatusCount
          color={statusColors.skipped}
          name="Skipped"
          count={summary.skipped}
        />
        <StatusCount
          color={statusColors.not_executed}
          name="Not Executed"
          count={summary.not_executed}
        />
      </Space>
    </Row>
  )
}

export default TestSummary
