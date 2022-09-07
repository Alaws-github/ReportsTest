import React from 'react'
import { Form, Input, Button, Row, Alert } from 'antd'
import TextArea from 'antd/lib/input/TextArea'

function CustomSuite({ onClick, saveForm, loading }) {
  const [form] = Form.useForm()
  return (
    <>
      <Alert
        type="info"
        message="Enter a title and description for your custom suite"
      />
      <div style={{ padding: 50 }}>
        <Form
          layout="vertical"
          form={form}
          name="custom-suite"
          onFinish={async (values) => {
            saveForm(values)
          }}
          scrollToFirstError
        >
          <Form.Item
            name="title"
            label="Title"
            initialValue={``}
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
            initialValue={``}
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
        <Button onClick={onClick} type="ghost">
          {' '}
          Back{' '}
        </Button>
        <Button
          form="custom-suite"
          loading={loading}
          htmlType="submit"
          style={{ marginLeft: 3 }}
          type="primary"
        >
          {' '}
          Create Test Suite{' '}
        </Button>
      </Row>
    </>
  )
}

export default CustomSuite
