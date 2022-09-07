import {
  Modal,
  Alert,
  Upload,
  Divider,
  Form,
  Input,
  Row,
  Button,
  Spin,
  List,
  Avatar,
} from 'antd'
import { InboxOutlined, FileExcelOutlined } from '@ant-design/icons'
import { v4 as uuid } from 'uuid'

import { uploadCustomSuite } from '../../../Util/API/TestSuites'

import { useQueryClient } from 'react-query'

import { Notification } from '../../Common/Feedback'
import { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import Text from 'antd/lib/typography/Text'

const { Dragger } = Upload
const { TextArea } = Input

const ImportTestSuiteModal = ({ visible, onCancel, projectId }) => {
  const queryClient = useQueryClient()
  const [uploadId, setUploadId] = useState(null)
  const [status, setStatus] = useState('Uploading...')
  const [fileList, setFileList] = useState([])
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [alert, setAlert] = useState('')
  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file])
      return false
    },
    fileList,
    maxCount: 1,
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  }

  const cleanUpOnClose = () => {
    onCancel()
    setAlert('')
    setFileList([])
    form.resetFields()
  }

  const handleUpload = (values) => {
    setAlert('')
    setUploading(true)
    const file = fileList[0]
    const uid = uuid()
    setUploadId(uid)
    const options = {
      suiteName: values.title,
      projectId,
      suiteDescription: values.description,
      contentType: file.type,
      uploadId: uid,
    }

    uploadCustomSuite(
      options,
      file,
      (status) => {
        setStatus(status)
      },
      (data) => {
        const { error, message, body } = data
        //check for status update
        if (body?.uploadStatus) {
          queryClient.invalidateQueries('testSuites')
          Notification(
            'success',
            'You have successfully imported a new test suite.'
          )
          cleanUpOnClose()
        }

        if (body?.uploadStatus === false) {
          setAlert('There was an issue importing your test suite.')
        }

        if (error) {
          Notification(
            'error',
            'There was an issue importing your test suite.',
            message
          )
        }
      }
    )
      .then(() => {
        setUploading(false)
      })
      .catch((error) => {
        //could not upload file
        setUploading(false)
      })
  }

  const DisplayFile = () => {
    return (
      <>
        {alert && (
          <Alert
            message="Unable to process file!"
            description="Ensure there is at least a Test Case Title column in your sheet/s."
            type="error"
            showIcon
            closable
          />
        )}
        <List
          itemLayout="horizontal"
          dataSource={[0]}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  onClick={() => {
                    setFileList([])
                    setAlert('')
                  }}
                  key="list-remove"
                  style={{ padding: 0 }}
                >
                  remove
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: '#87d068' }}
                    shape="square"
                    icon={<FileExcelOutlined />}
                    size="large"
                  />
                }
                title={fileList[item].name.split('.')[0]}
                description={`.${fileList[item].name.split('.')[1]}`}
              />
            </List.Item>
          )}
        />
      </>
    )
  }

  return (
    <Modal
      maskClosable={false}
      centered
      destroyOnClose
      visible={visible}
      width={1300}
      title="Import Test Suite"
      okText="Save"
      footer={null}
      cancelText="Cancel"
      onCancel={cleanUpOnClose}
    >
      <div style={{ paddingTop: 8 }}>
        <Alert
          message="Enter the a suite name, description and select your test suite for importing"
          type="info"
          showIcon
        />
      </div>
      <Spin spinning={uploading} tip={status}>
        <div style={{ padding: 50 }}>
          <Form
            layout="vertical"
            form={form}
            name="import-test-suite"
            onFinish={(values) => {
              handleUpload(values)
            }}
            scrollToFirstError
          >
            <Form.Item
              name="title"
              label="Title"
              initialValue=""
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
              initialValue=""
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
            <Form.Item name="select-file" label="Upload File">
              <Text strong>
                Please download the sample to use as a starting point
              </Text>
              <br />
              <Text strong>
                or ensure that your current spreadsheet have the following
                columns:
              </Text>
              <br />
              <br />
              <Text style={{ fontSize: 13 }}>
                Priority | Category | Test Case Title | Steps | Data |
                Pre-conditions | Expected Results
              </Text>
              <br />
              <Text style={{ fontSize: 12 }} type="secondary" italic>
                * only the "Test Case Title" column is required
              </Text>
              <br />
              <br />
              <a
                href="/suite-template/suite-import-template.xlsx"
                download="qualitywatcher_suite-import-template"
              >
                Download Sample
              </a>
            </Form.Item>
          </Form>
          <Divider />
          {fileList.length === 0 ? (
            <div>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single file upload, and .xlsx or .xls file
                  extension.
                </p>
              </Dragger>
            </div>
          ) : (
            <DisplayFile file={fileList[0]} />
          )}
          <Row
            justify="end"
            style={{
              marginTop: 15,
            }}
          >
            <Button
              loading={uploading}
              disabled={fileList.length < 1}
              type="primary"
              form="import-test-suite"
              htmlType="submit"
            >
              Start Import
            </Button>
          </Row>
        </div>
      </Spin>
    </Modal>
  )
}

export default ImportTestSuiteModal
