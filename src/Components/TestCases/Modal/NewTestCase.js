import React, { useEffect } from 'react'
import { Modal, Form, Input, Row, Select } from 'antd'
import Editor from '../../Common/Editor'
import { referenceToolTips } from '../../../constants'
import { useRouteMatch } from 'react-router-dom'

function NewTestCase({
  visible,
  onCreate,
  onCancel,
  loading,
  workspace,
  sections,
  currentSection,
}) {
  const match = useRouteMatch('/:projectId')
  const projectCustomId = match?.params?.projectId

  const projectIndex = workspace?.projects?.findIndex(
    (project) => Number(project.customId) === Number(projectCustomId)
  )
  const integratedProjectKey =
    workspace?.projects?.[projectIndex]?.integratedProjectKey
  const referenceUrl = workspace?.integrations?.[projectIndex]?.hostUrl
    ? workspace?.integrations?.[projectIndex]?.hostUrl
    : ''

  const [form] = Form.useForm()
  const { Option } = Select

  useEffect(() => {
    form.setFieldsValue({
      section: currentSection?.id || null,
    })
  })

  return (
    <Modal
      maskClosable={false}
      confirmLoading={loading}
      destroyOnClose
      visible={visible}
      title={`Add a new test case`}
      okText="Create"
      width={600}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values)
          })
          .catch((info) => { })
      }}
    >
      <Form form={form} preserve={false} layout="vertical" name="form_in_modal">
        <Form.Item
          name="title"
          label="Title"
          initialValue={``}
          rules={[
            {
              required: true,
              message: 'Please input the title!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Row wrap={false}>
          <Form.Item
            name="priority"
            label="Priority"
            style={{ fontWeight: 700, width: '23%', marginRight: '1em' }}
            rules={[]}
          >
            <Select placeholder="Select a priority" style={{ width: '100%' }}>
              <Option value="P1">P1</Option>
              <Option value="P2">P2</Option>
              <Option value="P3">P3</Option>
              <Option value="P4">P4</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="section"
            label="Section"
            style={{ fontWeight: 700, width: '78%' }}
            rules={[]}
          >
            <Select
              placeholder="Select a section"
              style={{ width: '100%' }}
              allowClear
            >
              {sections?.map((section) => (
                <Option key={section?.id} value={section?.id}>
                  {section?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Row>
        <Row wrap={false}>
          <Form.Item
            name="referenceKey"
            label="Reference ID"
            style={{ fontWeight: 700, marginRight: 15 }}
            tooltip={{ title: referenceToolTips.referenceId }}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (integratedProjectKey) {
                    if (!value) return Promise.resolve()
                    if (value && value.includes(`${integratedProjectKey}-`)) {
                      return Promise.resolve()
                    }
                    if (value && !value.includes(`${integratedProjectKey}-`)) {
                      return Promise.reject(
                        new Error(
                          `Reference ID should include (${integratedProjectKey}-)`
                        )
                      )
                    } else {
                      return Promise.resolve()
                    }
                  } else {
                    return Promise.resolve()
                  }
                },
              }),
            ]}
          >
            <Input
              placeholder={
                integratedProjectKey ? `${integratedProjectKey}-345` : ''
              }
            />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.referenceKey !== currentValues.referenceKey &&
              referenceUrl
            }
          >
            {({ getFieldValue, setFieldsValue }) => {
              const referenceData = getFieldValue('referenceKey')
              if (referenceUrl)
                setFieldsValue({
                  referenceUrl: referenceUrl
                    ? referenceData
                      ? `${referenceUrl}/browse/${referenceData}`
                      : `${referenceUrl}/browse/${integratedProjectKey}-345`
                    : '',
                })
              return (
                <Form.Item
                  tooltip={{ title: referenceToolTips.referenceUrl }}
                  name="referenceUrl"
                  label="Reference URL"
                  style={{ fontWeight: 700, width: '100%' }}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (value) {
                          const rId = getFieldValue('referenceKey')

                          if (!rId) return Promise.resolve()

                          if (rId && value.includes(rId)) {
                            return Promise.resolve()
                          }

                          if (rId && !value.includes(rId)) {
                            return Promise.reject(
                              new Error(
                                `Reference URL should include (${rId}) to be valid!`
                              )
                            )
                          }
                        } else {
                          return Promise.resolve()
                        }
                      },
                    }),
                  ]}
                >
                  <Input disabled={referenceUrl} style={{ width: '100%' }} />
                </Form.Item>
              )
            }}
          </Form.Item>
        </Row>
        <Form.Item name="precondition" label="Precondition" initialValue={``}>
          <Editor
            getDataFromEditor={(data) => {
              form.setFieldsValue({
                precondition: data,
              })
            }}
          />
        </Form.Item>
        <Form.Item name="body" label="Test Steps" initialValue={``}>
          <Editor
            getDataFromEditor={(data) => {
              form.setFieldsValue({
                body: data,
              })
            }}
          />
        </Form.Item>
        <Form.Item
          name="expectedResults"
          label="Expected Results"
          initialValue={``}
        >
          <Editor
            getDataFromEditor={(data) => {
              form.setFieldsValue({
                expectedResults: data,
              })
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default NewTestCase
