import React, { useEffect } from 'react'
import { Card, Input, Form, Select, Button, Row, Col } from 'antd'
import Editor from '../Common/Editor'
import TestCasePreview from '../Common/TestCasePreview'
import { referenceToolTips } from '../../constants'
import { useRouteMatch } from 'react-router-dom'

const TestCaseEditor = ({
  testCase,
  title,
  height,
  editMode,
  categories,
  saveUpdatedTestCase,
  loading,
  workspace,
  sections,
}) => {
  const [form] = Form.useForm()
  const match = useRouteMatch('/:projectId')
  const projectCustomId = match?.params?.projectId


  const projectIndex = workspace?.projects?.findIndex(
    (project) => Number(project?.customId) === Number(projectCustomId)
  )
  const integratedProjectKey =
    workspace?.projects?.[projectIndex]?.integratedProjectKey
  const referenceUrl = workspace?.integrations?.[projectIndex]?.hostUrl
    ? workspace?.integrations?.[projectIndex]?.hostUrl
    : ''

  useEffect(() => {
    form.setFieldsValue({
      title: testCase?.title || '',
      priority: testCase?.priority || null,
      precondition: testCase?.precondition || '',
      section: testCase?.section || null,
      body: testCase?.body || '',
      expectedResults: testCase?.expectedResults || '',
      referenceKey: testCase?.referenceKey || '',
      referenceUrl: testCase?.referenceUrl
        ? testCase?.referenceUrl
        : referenceUrl
          ? `${referenceUrl}/browse/${integratedProjectKey}-345`
          : '',
    })
  }, [testCase])

  const { Option } = Select

  if (!editMode)
    return (
      <TestCasePreview
        testCase={testCase}
        title={title}
        height={height}
        categories={categories}
        workspace={workspace}
        sections={sections}
      />
    )

  return (
    <div>
      {testCase ? (
        <Card
          className="shadow-sm"
          title={title}
          actions={[
            <Button
              loading={loading}
              form="edit-case"
              type="primary"
              htmlType="submit"
            >
              Save Changes
            </Button>,
          ]}
        >
          <div style={{ height: 'calc(100vh - 25.6em)', overflow: 'auto' }}>
            <Form
              scrollToFirstError
              name="edit-case"
              layout="vertical"
              form={form}
              onFinish={(values) => {
                if (values.section === undefined) values.section = null
                values.category = testCase?.category
                if (!values?.referenceKey) {
                  values.referenceUrl = ''
                }
                saveUpdatedTestCase(values)
              }}
              onFinishFailed={() => { }}
            >
              <Form.Item
                name="title"
                label="Title"
                style={{ fontWeight: 700 }}
                rules={[
                  {
                    required: true,
                    message: 'Please input the title!',
                  },
                ]}
              >
                <Input placeholder="Enter a test case title" />
              </Form.Item>
              <Row wrap={false}>
                <Form.Item
                  name="priority"
                  label="Priority"
                  style={{ fontWeight: 700, width: '23%', marginRight: '1em' }}
                  rules={[]}
                >
                  <Select
                    placeholder="Select a priority"
                    style={{ width: '100%' }}
                  >
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
                    {sections.map((section) => (
                      <Option key={section?.id} value={section?.id}>
                        {section?.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Row>

              <Row wrap={false}>
                <Form.Item
                  tooltip={{
                    title: referenceToolTips.referenceId,
                  }}
                  name="referenceKey"
                  label="Reference ID"
                  style={{ fontWeight: 700, marginRight: 15 }}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (integratedProjectKey) {
                          if (!value) return Promise.resolve()

                          if (
                            value &&
                            value.includes(`${integratedProjectKey}-`)
                          ) {
                            return Promise.resolve()
                          }

                          if (
                            value &&
                            !value.includes(`${integratedProjectKey}-`)
                          ) {
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
                        tooltip={{
                          title: referenceToolTips.referenceUrl,
                        }}
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
                        <Input
                          disabled={referenceUrl}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    )
                  }}
                </Form.Item>
              </Row>
              <Form.Item
                name="precondition"
                label="Precondition"
                style={{ fontWeight: 700 }}
              >
                <Editor
                  getDataFromEditor={(data) => {
                    form.setFieldsValue({
                      precondition: data,
                    })
                  }}
                />
              </Form.Item>
              <Form.Item
                name="body"
                label="Test Steps"
                style={{ fontWeight: 700 }}
              >
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
                style={{ fontWeight: 700 }}
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
          </div>
        </Card>
      ) : (
        <></>
      )}
    </div>
  )
}

export default TestCaseEditor
