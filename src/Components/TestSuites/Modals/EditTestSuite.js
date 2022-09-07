import React, { useState } from 'react'
import { Modal, Form, Input, Row, Col } from 'antd'
import { Notification } from '../../Common/Feedback'
import { useTestSuitesMutation } from '../../../Util/API/TestSuites'

function EditTestSuite({ visible, record, onSuccess, onCancel }) {
  const { editTestSuite } = useTestSuitesMutation()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  return (
    <div>
      <div>
        <Modal
          confirmLoading={loading}
          destroyOnClose
          visible={visible}
          width={800}
          title="Edit Test Suite"
          okText="Save"
          cancelText="Cancel"
          onCancel={onCancel}
          onOk={() => {
            form
              .validateFields()
              .then(async (values) => {
                values.id = record.id
                setLoading(true)
                editTestSuite(values)
                  .then(() => {
                    setLoading(false)
                    Notification('success', 'Your test suite was updated.')
                    onSuccess()
                  })
                  .catch((error) => {
                    console.log(error)
                    setLoading(false)
                    Notification(
                      'error',
                      'Your test suite was not updated. Try again later!'
                    )
                  })
              })
              .catch((info) => {
                console.log('Validate Failed:', info)
              })
          }}
        >
          <Form
            form={form}
            preserve={false}
            layout="vertical"
            name="form_in_modal"
          >
            <Row>
              <Col flex="auto" md={24}>
                <Form.Item
                  name="title"
                  label="Title"
                  initialValue={record?.title}
                  rules={[
                    {
                      required: true,
                      message: 'A title is required!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col flex="auto" md={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  initialValue={record?.description}
                  rules={[
                    {
                      required: true,
                      message: 'A description is required!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default EditTestSuite
