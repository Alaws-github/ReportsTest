import React, { useState } from 'react'
import {
  Modal,
  Form,
  Input,
  List,
  Empty,
  Row,
  Button,
  Spin,
  Tag,
  Col,
  Divider,
} from 'antd'
import Title from 'antd/lib/typography/Title'
import { InfoCircleOutlined } from '@ant-design/icons'

function GenerateTestCase({
  visible,
  onCreate,
  getTestCases,
  onCancel,
  loading,
  data,
  creatingTestCase,
  onCreateAll,
}) {
  const [form] = Form.useForm()
  const userStory =
    'As a registered user, I want to be able to find other registered users so that I can send them messages'
  const ac = `When I message another user
Then the other user and I should be the only ones who can see the conversation.
When I message another user
Then they should receive a message notification.`

  const sampleRequirement =
    userStory.trim() + '\nAcceptance Criteria\n' + ac.trim()

  const generateTestCases = () => {
    form
      .validateFields()
      .then((values) => {
        const { userStory, acceptanceCriteria } = values
        const requirement =
          userStory.trim() +
          '\nAcceptance Criteria\n' +
          acceptanceCriteria.trim()
        getTestCases(requirement)
      })
      .catch((info) => {})
  }

  return (
    <Modal
      maskClosable={false}
      confirmLoading={loading}
      destroyOnClose
      visible={visible}
      title={<>Create Test Cases using AI</>}
      okText="Create"
      width={1300}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={onCreateAll}
      footer={null}
    >
      <Spin spinning={loading} tip="QualityWatcher AI is working...">
        <Row
          style={{
            height: '62vh',
          }}
        >
          <Col
            span={9}
            style={{
              height: '65vh',
              overflow: 'auto',
              margin: '0px 10px',
              padding: '0px 10px',
            }}
            className="hide-scrollbar"
          >
            <Form
              form={form}
              preserve={false}
              layout="vertical"
              name="gtc_form_in_modal"
            >
              <Form.Item
                name="userStory"
                label="User Story:"
                initialValue={``}
                rules={[
                  {
                    required: true,
                    message: 'Please input your User Story',
                  },
                ]}
              >
                <Input.TextArea placeholder={userStory} rows={2} />
              </Form.Item>
              <Form.Item
                tooltip={{
                  title:
                    'Each line of the acceptance criteria should be in sentence case, starting with one of the Gherkin keywords (Given, When, Then, And, But). There should not be any space between each line.',
                  icon: <InfoCircleOutlined />,
                }}
                name="acceptanceCriteria"
                label="Acceptance Criteria:"
                initialValue={``}
                rules={[
                  {
                    required: true,
                    message: 'Please input your Acceptance Criteria',
                  },
                  () => ({
                    validator(_, value) {
                      if (value) {
                        let pattern = /^Given|When|Then|But|And/gm
                        const numberOfMatches = value?.match(pattern)?.length
                        const numberOfNewLines =
                          value?.split(/\r\n|\r|\n/)?.length || 0
                        if (numberOfMatches === numberOfNewLines) {
                          return Promise.resolve()
                        } else {
                          return Promise.reject(
                            new Error(
                              'Each line must start with a Gherkin keyword (Given, When, Then, And, But), followed by any text you like.'
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
                <Input.TextArea placeholder={ac} rows={8} />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.userStory !== currentValues.userStory ||
                  prevValues.acceptanceCriteria !==
                    currentValues.acceptanceCriteria
                }
              >
                {({ getFieldValue }) => {
                  const userStory = getFieldValue('userStory')
                  const ac = getFieldValue('acceptanceCriteria')
                  if (userStory !== '' && ac !== '')
                    form.setFieldsValue({
                      requirement:
                        userStory.trim() +
                        '\nAcceptance Criteria\n' +
                        ac.trim(),
                    })
                  return (
                    <Form.Item
                      name="requirement"
                      label="Preview:"
                      rules={[
                        {
                          max: 400,
                          message:
                            'User Story and Acceptance Criteria cannot be more than 400 characters',
                        },
                      ]}
                    >
                      <Input.TextArea
                        showCount
                        maxLength={400}
                        disabled
                        placeholder={sampleRequirement}
                        rows={12}
                      />
                    </Form.Item>
                  )
                }}
              </Form.Item>
            </Form>
          </Col>
          <Col>
            <Divider
              style={{
                height: '65vh',
                marginLeft: 20,
                marginRight: 20,
              }}
              type="vertical"
            />
          </Col>
          <Col
            span={12}
            style={{
              height: '65vh',
              overflow: 'auto',
            }}
            className="hide-scrollbar"
          >
            <Title level={5}>Test Case Preview</Title>
            {data?.length > 0 ? (
              <>
                <List
                  loading={creatingTestCase}
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={(item, index) => (
                    <List.Item
                      actions={[
                        <Button
                          onClick={() => onCreate({ item, index })}
                          type="link"
                          key="list-loadmore-more"
                          disabled={item.added}
                        >
                          {item.added
                            ? 'Test case created'
                            : 'Create test case'}
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta title={item.title} />
                    </List.Item>
                  )}
                />
              </>
            ) : (
              <Row
                style={{
                  marginTop: '25%',
                }}
                justify="center"
              >
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
              </Row>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={9}>
            <Row
              justify="end"
              style={{
                paddingTop: 25,
              }}
            >
              <Button type="primary" onClick={() => generateTestCases()}>
                Generate Test Cases
              </Button>
            </Row>
          </Col>
        </Row>
      </Spin>
    </Modal>
  )
}

export default GenerateTestCase
