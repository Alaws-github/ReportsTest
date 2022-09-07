import { Tag } from 'antd'
import React from 'react'
import { statusColors } from '../../constants'

function StatusTag({ status }) {
  const renderStatus = () => {
    if (status === 'passed') {
      return <Tag color={statusColors.passed}>PASSED</Tag>
    }
    if (status === 'failed') {
      return <Tag color={statusColors.failed}>FAILED</Tag>
    }
    if (status === 'blocked') {
      return <Tag color={statusColors.blocked}>BLOCKED</Tag>
    }
    if (status === 'skipped') {
      return <Tag color={statusColors.skipped}>SKIPPED</Tag>
    }
    if (status === 'not executed') {
      return <Tag color={statusColors.not_executed}>NOT EXECUTED</Tag>
    }
  }
  return renderStatus()
}

export default StatusTag
