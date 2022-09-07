import React from 'react'
import { Form, Input, Button, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea'

function StepThreeContent({
  onFormSave,
  onBack,
  loading,
  details,
  setTestCaseDetails
}) {
  const [form] = Form.useForm()
  return (
    <div>
      <div style={{ padding: 50 }}>
        <Form
          layout="vertical"
          form={form}
          name="test-suite"
          onFinish={(values) => {
            onFormSave(values)
          }}
          scrollToFirstError
        >
          <Form.Item
            name="title"
            label="Title"
            initialValue={details?.title}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please input a title',
              },
            ]}
          >
            <Input
              placeholder="Enter a name for your test suite"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            initialValue={details?.description}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please input a description',
              },
            ]}
          >
            <TextArea
              placeholder="Enter a description for your test suite"
              size="large"
            />
          </Form.Item>
        </Form>
      </div>
      <Row
        justify="end"
        style={{
          marginTop: '8px',
        }}
      >
        <Button onClick={() => {
          setTestCaseDetails(form.getFieldsValue())
          onBack()
        }} style={{ margin: '0 8px' }}>
          Previous
        </Button>
        <Button
          loading={loading}
          type="primary"
          form="test-suite"
          htmlType="submit"
        >
          Done
        </Button>
      </Row>
    </div>
  )
}

export default React.memo(StepThreeContent)
