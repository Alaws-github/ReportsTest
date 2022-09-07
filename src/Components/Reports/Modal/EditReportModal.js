import React, { useState, useEffect } from 'react'
import { Modal, Input, Form, Row, Button } from 'antd'
import { useReportServiceMutation } from '../../../Util/API/Report'
import { Notification } from '../../Common/Feedback'

const EditReportModal = ({ isVisible, setVisible, report }) => {
  const { updateReport } = useReportServiceMutation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleUpdateReport = (data) => {
    setLoading(true)
    const payload = {
      name: data.reportName,
    }

    updateReport(report.id, payload)
      .then(() => {
        Notification('success', `You have successfully updated the report!`)
        setLoading(false)
        setVisible(false)
        form.resetFields()
      })
      .catch(() => {
        Notification(
          'error',
          `Could not update report! Please try again later!`
        )
        setLoading(false)
        setVisible(false)
      })
  }

  useEffect(() => {
    form.setFieldsValue({
      reportName: report?.name,
    })
  }, [report])

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      width={1300}
      visible={isVisible}
      onCancel={() => setVisible(false)}
      footer={null}
      title="Edit Report Name"
      style={{
        marginTop: 100,
      }}
    >
      <div style={{ paddingX: 50 }}>
        <Form
          layout="vertical"
          form={form}
          name="report-form"
          onFinish={handleUpdateReport}
        >
          <Form.Item
            label="Report Name"
            name="reportName"
            rules={[{ required: true, message: 'Please input a report name!' }]}
          >
            <Input placeholder="Enter a name for your report" size="large" />
          </Form.Item>
          <Form.Item>
            <Row justify="center">
              <Button
                loading={loading}
                disabled={loading}
                type="primary"
                htmlType="submit"
              >
                Save
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default EditReportModal
