import { Col, Row, Table, Tag } from 'antd'
import Text from 'antd/lib/typography/Text'
import React from 'react'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import Icon from '@ant-design/icons'
import { FaRegCircle } from 'react-icons/fa'
import { CgPlayTrackNextO } from 'react-icons/cg'

const statusData = {
  passed: {
    icon: <CheckCircleOutlined />,
    color: 'green',
  },
  failed: {
    icon: <CloseCircleOutlined />,
    color: 'red',
  },
  blocked: {
    icon: <ExclamationCircleOutlined />,
    color: 'yellow',
  },
  skipped: {
    icon: <Icon component={CgPlayTrackNextO} />,
    color: 'blue',
  },
}

function TestCaseList({
  testCases,
  selectedTestCase,
  setSelectedTestCase,
  refs,
}) {
  const customRender = (record) => {
    return (
      <>
        <Tag
          icon={
            statusData[record.status] ? (
              statusData[record.status].icon
            ) : (
              <Icon component={FaRegCircle} />
            )
          }
          color={
            statusData[record.status] ? statusData[record.status].color : ''
          }
        >
          {'TC' + record.customId}
        </Tag>
      </>
    )
  }
  const column = [
    {
      title: 'ID',
      width: 105,
      render: (record) => {
        return customRender(record)
      },
    },
    {
      title: 'Title',
      render: (text, record, index) => {
        return (
          <div
            ref={refs ? refs[index] : null}
            data-type="tx"
            data-typeId={record.testRunId}
            className={
              record.testRunId === selectedTestCase?.testRunId
                ? 'active-test-row'
                : ''
            }
          >
            <Row align="middle">
              <Col md={22}>
                <span>
                  <Text>{record.title}</Text>
                </span>
              </Col>
              <Col md={1}>
                <Row justify="end"></Row>
              </Col>
            </Row>
          </div>
        )
      },
    },
  ]

  return (
    <div
      style={{
        height: 'calc(100vh - 20em)',
      }}
    >
      <Table
        bordered={false}
        rowKey="testRunId"
        rowClassName={(record, index) =>
          record?.testRunId === selectedTestCase?.testRunId ? 'selectedRow' : ''
        }
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setSelectedTestCase({
                testCase: record,
                index: rowIndex,
              })
            },
          }
        }}
        title={() => 'Test Cases'}
        pagination={false}
        footer={() => ''}
        scroll={{ y: 'calc(100vh - 29.5em)' }}
        columns={column}
        dataSource={testCases}
      />
    </div>
  )
}

export default TestCaseList
