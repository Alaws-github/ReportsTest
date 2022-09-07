import React from 'react'
import { Form, Input, Button, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea'

function StepOneContent({ onFormSave, details, loading }) {
  const [form] = Form.useForm()
  return (
    <div>
      <div style={{ padding: 50 }}>
        <Form
          layout="vertical"
          form={form}
          name="test-run"
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
              { max: 255, message: 'Title must be less than 255 characters' },
            ]}
          >
            <Input placeholder="Enter a name for your test run" size="large" />
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
              placeholder="Enter a description for your test run"
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
        <Button
          loading={loading}
          type="primary"
          form="test-run"
          htmlType="submit"
        >
          Next
        </Button>
      </Row>
    </div>
  )
}

export default StepOneContent
