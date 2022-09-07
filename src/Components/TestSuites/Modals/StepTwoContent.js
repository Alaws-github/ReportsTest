import { Alert, Col, Row, Table, Tag, Button, Typography, Space } from 'antd'
import React, { useState, useEffect } from 'react'
import TestCasePreview from '../../Common/TestCasePreview'

function StepTwoContent({
  testCases,
  title,
  onNext,
  onBack,
  savedTestCases,
}) {
  const [preview, setPreview] = useState()
  const [selectedTestCases, setSelectedTestCases] = useState([])
  const { Title } = Typography
  const columns = [
    {
      title: 'TEST CASE',
      width: 500,
      render: (record) => {
        return (
          <Row align="middle">
            <Col md={24}>
              <span>{record.title}</span>
            </Col>
          </Row>
        )
      },
    },
  ]
  const rowSelection = {
    selectedRowKeys: selectedTestCases.map((sr) => sr.id),
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedTestCases(selectedRows)
    },
  }

  useEffect(() => {
    if (savedTestCases.length !== 0) {
      setSelectedTestCases(savedTestCases)
    }
  }, [])

  return (
    <div>
      <div style={{ paddingTop: 8, paddingBottom: 8 }}>
        <Alert
          message="Select the templates you would like to add to your suite"
          type="info"
          showIcon
        />
      </div>
      <Row gutter={[16, 16]} justify="space-between">
        <Col md={12}>
          <div>
            <Table
              rowKey="id"
              pagination={false}
              className="shadow-sm"
              rowClassName={(record, index) =>
                record.id === (preview && preview.id)
                  ? 'selectedRow'
                  : ''
              }
              scroll={{ y: 'calc(100vh - 39em)' }}
              title={() => {
                return (
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space>
                        <Title level={5} style={{ marginTop: 6 }}>
                          {title}
                        </Title>
                        <Tag>{testCases.length}</Tag>
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
              bordered
              columns={columns}
              dataSource={testCases}
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    setPreview(record)
                  }, // click row
                }
              }}
            />
          </div>
        </Col>
        <Col md={12}>
          <TestCasePreview height="calc(100vh - 33.3em)" testCase={preview} />
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
          onClick={() => onNext(selectedTestCases)}
          disabled={selectedTestCases.length === 0}
          type="primary"
        >
          Next
        </Button>
      </Row>
    </div>
  )
}

export default React.memo(StepTwoContent)
