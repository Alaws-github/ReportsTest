import React, { useState, useEffect } from 'react'
import { Modal, Select, Input, Form, Typography, Row, Button } from 'antd'
import { utcToZonedTimeFormat } from '../../../Util/util'
import EllipsisTooltip from '../../Common/EllipsisTooltip'
import { useReportServiceMutation } from '../../../Util/API/Report'
import { Notification } from '../../Common/Feedback'
import { useHistory } from 'react-router-dom'

const { Text } = Typography
const { Option } = Select

const GenerateReportModal = ({
  isVisible,
  setVisible,
  testRunsData,
  projectId,
  workspaceId,
}) => {
  const { generateReport } = useReportServiceMutation()
  const [form] = Form.useForm()
  const [testRuns, setTestRuns] = useState([])
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const onGenerate = (data) => {
    setLoading(true)
    const payload = {
      project_id: projectId,
      test_execution_id: data.testRun,
      name: data.reportName,
      report_options: [
        'QUALITY-METER',
        'EXECUTION-SUMMARY',
        'TEST-SUITE-SUMMARY',
      ],
    }
    generateReport(payload)
      .then((report) => {
        Notification('success', `You have successfully generated a new report!`)
        setLoading(false)
        setVisible(false)
        form.resetFields()
        history.push(`reports/${report?.id}`)
      })
      .catch(() => {
        Notification(
          'error',
          `Could not generate report! Please try again later!`
        )
        setLoading(false)
        setVisible(false)
      })
  }

  useEffect(() => {
    if (testRunsData?.length && !testRunsData?.includes(undefined)) {
      const _testRuns = testRunsData.reduce((prevTestRun, testRun) => {
        const runOption = {
          value: testRun.id,
          label: (
            <div>
              <EllipsisTooltip
                placement="bottom"
                title={
                  <Text
                    level={5}
                    style={{
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    {testRun.title}
                  </Text>
                }
              >
                <Text
                  level={5}
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  {testRun.title}
                </Text>
              </EllipsisTooltip>
              <Text type="secondary">
                by {testRun?.author === 'null null' ? 'Admin' : testRun?.author}
                , {utcToZonedTimeFormat(testRun?.createdAt)}
              </Text>
            </div>
          ),
          key: testRun?.id,
        }

        return [
          ...prevTestRun,
          <Option key={runOption.key} value={runOption.value}>
            {runOption.label}
          </Option>,
        ]
      }, [])

      setTestRuns([..._testRuns])
    }
  }, [testRunsData])

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      width={1300}
      visible={isVisible}
      onCancel={() => setVisible(false)}
      footer={null}
      title="Generate Report"
      style={{
        marginTop: 100,
      }}
    >
      <div style={{ paddingX: 50 }}>
        <Form
          layout="vertical"
          form={form}
          name="report-form"
          onFinish={onGenerate}
        >
          <Form.Item
            label="Report Name"
            name="reportName"
            rules={[{ required: true, message: 'Please input a report name!' }]}
          >
            <Input placeholder="Enter a name for your report" size="large" />
          </Form.Item>
          <Form.Item
            name="testRun"
            label="Test Run"
            rules={[
              {
                required: true,
                message: 'Please select a test run!',
              },
            ]}
          >
            <Select
              placeholder="Select a test run for your report"
              size="large"
            >
              {[...testRuns]}
            </Select>
          </Form.Item>
          <Form.Item>
            <Row justify="center">
              <Button
                loading={loading}
                disabled={loading}
                type="primary"
                htmlType="submit"
              >
                Generate
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default GenerateReportModal
