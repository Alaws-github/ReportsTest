import React, { useState, useEffect } from 'react'
import { Modal, Tag, Form, Input, Typography } from 'antd'
import EditorJira from '../../Common/EditorJira'
import { JSONTransformer } from '@atlaskit/editor-json-transformer'
import EditorReduce from '../../Common/EditorReduce'
import { convertToMarkdown } from '../../../Util/util'
import { useJiraMutation } from '../../../Util/API/Jira'
import { Notification } from '../../Common/Feedback'

const { Title } = Typography

const CreateBugModal = ({
  isModalVisible,
  setModalVisible,
  issue,
  testCase,
}) => {
  const [form] = Form.useForm()
  const [editorData, setEditorData] = useState('')
  const [editorActions, setEditorActions] = useState(null)
  const [currentTitle, setCurrentTitle] = useState('')
  const [readyIssue, setReadyIssue] = useState({})
  const [loading, setLoading] = useState(false)
  const transformer = new JSONTransformer()
  const { createIssue } = useJiraMutation()

  const onCreate = (jsonData) => {
    setLoading(true)
    const bug = {
      ...readyIssue,
    }
    bug.fields.summary = jsonData.title
    bug.fields.description = jsonData.jiraDoc
    const data = {
      test_run_id: testCase.testRunId,
      defect_body: {
        ...bug,
      },
    }
    createIssue(data)
      .then((response) => {
        Notification(
          'success',
          'The defect was successfully created in Jira.',
          'Defect created!'
        )
        setLoading(false)
        setModalVisible(false)
      })
      .catch((error) => {
        console.log({ error })
        Notification(
          'error',
          'Could not create a defect in Jira. Please try again later!',
          'Could not create a defect!'
        )
        setLoading(false)
      })
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const jiraDoc = transformer.encode(editorActions.editorView.state.doc)
        onCreate({ title: values.title, jiraDoc })
      })
      .catch((validateError) => {
        console.log({ validateError })
      })
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  useEffect(() => {
    const _issue = JSON.parse(issue)
    if (_issue.fields) {
      form.setFieldsValue({
        title: _issue?.fields?.summary,
      })
      setCurrentTitle(_issue?.fields?.summary)
      setReadyIssue(_issue)
    }
  }, [issue])

  return (
    <Modal
      title={
        <>
          Create Issue
          <br />
          <Tag color="red">BUG</Tag>
        </>
      }
      visible={isModalVisible}
      onOk={handleOk}
      okText="Create"
      onCancel={handleCancel}
      width={800}
      destroyOnClose={true}
      maskClosable={false}
      confirmLoading={loading}
    >
      <Form scrollToFirstError name="jira-editor" layout="vertical" form={form}>
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please input title',
            },
          ]}
        >
          <Input onInput={(event) => setCurrentTitle(event.target.value)} />
        </Form.Item>
        <Form.Item label="Description">
          <div>
            <EditorReduce
              value={
                typeof readyIssue?.fields?.description !== 'object'
                  ? readyIssue?.fields?.description
                  : editorData
              }
              getDataFromEditor={(data) => setEditorData(data)}
            />
          </div>
        </Form.Item>
        <Form.Item label="Jira Preview">
          <Title level={5}>{currentTitle}</Title>
          <EditorJira
            document={
              editorData !== ''
                ? convertToMarkdown(editorData, true)
                : readyIssue?.fields?.description
            }
            handleCancel={handleCancel}
            onCreate={onCreate}
            testTitle={readyIssue?.fields?.summary}
            form={form}
            getActions={(actions) => setEditorActions(actions)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateBugModal
