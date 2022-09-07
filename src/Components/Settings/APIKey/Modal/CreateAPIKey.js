import { Modal, Form, Input, Row, Button } from 'antd'
const CreateAPIKey = ({ isVisible, onCancel, onCreateAPIKey, loading }) => {
  const [form] = Form.useForm()
  return (
    <Modal
      title="Create API Key"
      visible={isVisible}
      onCancel={onCancel}
      centered={true}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(value) => {
          onCreateAPIKey(value)
        }}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="API Key Name"
          rules={[{ required: true, message: 'Please input an API Key name' }]}
        >
          <Input placeholder="Please enter an API Key name based on usage" />
        </Form.Item>
        <Form.Item>
          <Row justify="center">
            <Button loading={loading} type="primary" htmlType="submit">
              Create
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateAPIKey
