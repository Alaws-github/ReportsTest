import {
  Alert,
  Col,
  Row,
  Table,
  Tag,
  Button,
  Typography,
  Space,
} from 'antd'
import React, { useState, useEffect } from 'react'
import TestCasePreview from '../../Common/TestCasePreview'
import { InfoCard } from './InfoCard'
import EllipsisTooltip from '../../Common/EllipsisTooltip'
import { useRouteMatch } from 'react-router-dom'
function StepTwoContent({
  testCases,
  onDone,
  onBack,
  selectedTestCases,
  setSelectedTestCases,
  loading,
  workspace,
  sections,
}) {
  const match = useRouteMatch()
  const projectId = match.params.projectId
  const [preview, setPreview] = useState()
  const { Title } = Typography
  const columns = [
    {
      title: 'Select All Test Cases',
      width: 500,
      key: 'id',
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 500,
          },
        }
      },
      render: (record) => {
        if ('projectId' in record) {
          return (
            <Row type="flex" align="middle">
              <Space>
                <b>{record?.title}</b>
                <Tag>{`${record?.numberOfTestCases}`}</Tag>
              </Space>
            </Row>
          )
        }

        if (record.type === 'section') {
          return (
            <Row type="flex" align="middle">
              <Space>
                <b>{record?.name}</b>
                <Tag>{`${record?.children?.length || 0}`}</Tag>
              </Space>
            </Row>
          )
        }

        return (
          <EllipsisTooltip title={record?.title}>
            {record?.title}
          </EllipsisTooltip>
        )
      },
    },
  ]
  const rowSelection = {
    selectedRowKeys: selectedTestCases.map((sr) => sr.id),
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedTestCases(
        selectedRows.filter((sr) => !sr.projectId && sr.type !== 'section')
      )
    },
  }

  const renderTestCaseList = () => {

    const numberOfTestCases = testCases?.reduce((acc, ts) => {
      if ('projectId' in ts) {
        return acc + ts.numberOfTestCases
      }
      return acc;
    }, 0);

    if (testCases.length === 0) {
      return <InfoCard projectId={projectId} title={'No test suite'} subTitle={'Create your first test suite with test case/s to create a test run'} />
    }

    if (numberOfTestCases === 0) {
      return <InfoCard projectId={projectId} title={'No test case'} subTitle={'Add test case/s in a test suite to create a test run'} />
    }

    return <Table
      rowKey="id"
      pagination={false}
      className="shadow-sm"
      rowClassName={(record, index) =>
        record?.id === preview?.id ? 'selectedRow' : ''
      }
      // footer={() => ''}
      scroll={{ y: 'calc(100vh - 39em)' }}
      style={{
        height: 'calc(100vh - 28em)',
      }}
      title={() => {
        return (
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Title level={5} style={{ marginTop: 6 }}>
                  Test Suites
                </Title>
                <Tag>{testCases?.length}</Tag>
              </Space>
            </Col>
            <Col>
              {selectedTestCases.length > 0 ? (
                <div>
                  <span>
                    {' '}
                    {`${selectedTestCases.length} Selected`}{' '}
                  </span>
                </div>
              ) : null}
            </Col>
          </Row>
        )
      }}
      bordered={false}
      columns={columns}
      expandable={{
        expandRowByClick: true,
        defaultExpandAllRows: selectedTestCases.length !== 0,
      }}
      dataSource={testCases || []}
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
        checkStrictly: false,
      }}
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            if ('projectId' in record || record.type === 'section') {
              event.preventDefault()
            } else {
              setPreview(record)
            }
          },
        }
      }}
    />
  }
  useEffect(() => {
    if (selectedTestCases) {
      setSelectedTestCases(selectedTestCases)
    }
  }, [selectedTestCases])

  return (
    <div>
      <div style={{ paddingTop: 8, paddingBottom: 8 }}>
        <Alert
          message="Select the test cases you would like to add to your run"
          type="info"
          showIcon
        />
      </div>
      <Row gutter={[16, 16]} justify="space-between">
        <Col md={12}>
          {renderTestCaseList()}
        </Col>
        <Col md={12}>
          <TestCasePreview
            workspace={workspace}
            height="calc(100vh - 31.8em)"
            testCase={preview}
            sections={sections}
          />
        </Col>
      </Row>
      <Row
        justify="end"
        style={{
          marginTop: '20px',
        }}
      >
        <Button
          onClick={() => onBack(selectedTestCases)}
          style={{ margin: '0 8px' }}
        >
          Previous
        </Button>
        <Button
          onClick={() => onDone(selectedTestCases)}
          disabled={selectedTestCases.length === 0}
          type="primary"
          loading={loading}
        >
          Done
        </Button>
      </Row>
    </div>
  )
}

export default React.memo(StepTwoContent)
