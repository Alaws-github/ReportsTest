import React from 'react'
import { Table, Button, Popconfirm, Space, Tooltip } from 'antd'
import {
  QuestionCircleOutlined,
  DeleteTwoTone,
  FolderOpenTwoTone,
  EditTwoTone,
} from '@ant-design/icons'
import { useTestSuitesMutation } from '../../Util/API/TestSuites'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { Notification } from '../Common/Feedback'
import Text from 'antd/lib/typography/Text'
import { useUser } from '../../Context/UserContext'

const TestSuiteList = ({
  setSelectedRow,
  setShowEditTestSuiteModal,
  onClick,
  dataSource,
  ...rest
}) => {
  const { isViewer } = useUser()
  const match = useRouteMatch()
  const projectId = match?.params?.projectId
  const history = useHistory()
  const iconStyle = {
    fontSize: 22,
  }
  const { deleteTestSuite } = useTestSuitesMutation()
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <b
          onClick={() => {
            history.push(`/${projectId}/test-cases/${record.customId}`)
          }}
        >
          {text}
        </b>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '',
      align: 'center',

      render: (record) => (
        <Space size="large">
          <Tooltip title={`Open`}>
            <Link
              to={`/${projectId}/test-cases/${record.customId}`}
            >
              <FolderOpenTwoTone twoToneColor="#52c41a" style={iconStyle} />
            </Link>
          </Tooltip>
          {!isViewer && (
            <Tooltip title={`Edit`}>
              <Link>
                <EditTwoTone
                  style={iconStyle}
                  onClick={() => {
                    setShowEditTestSuiteModal(true)
                    setSelectedRow(record)
                  }}
                />
              </Link>
            </Tooltip>
          )}
          {!isViewer && (
            <Link>
              <Popconfirm
                placement="bottom"
                title={
                  <div style={{ maxWidth: 250 }}>
                    <Text>
                      Are you sure you want to delete this Test Suite?
                    </Text>
                    <br />
                    <Text type="danger">
                      Note: Test Suite and its cases will be deleted from any
                      test run it is being used in.
                    </Text>
                  </div>
                }
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => {
                  deleteTestSuite(record.id)
                    .then(() => {
                      Notification('success', 'Your test suite was deleted.')
                    })
                    .catch((error) => {
                      Notification(
                        'error',
                        'Unable to delete test suite. Please try again later.'
                      )
                    })
                }}
              >
                <Tooltip title={`Delete`}>
                  <DeleteTwoTone twoToneColor="red" style={iconStyle} />
                </Tooltip>
              </Popconfirm>
            </Link>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="test-suite-list">
      <Table
        rowKey="id"
        bordered={false}
        size="large"
        className="shadow-sm"
        sticky
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              if (JSON.stringify(event.target.className).includes('ant')) {
                history.push(`/${projectId}/test-cases/${record.customId}`)
              }
            }, // click row
          }
        }}
        {...rest}
        dataSource={dataSource}
        columns={columns}
        footer={() => (
          <>
            {!isViewer && (
              <Button onClick={onClick} block size="middle" type="dashed">
                + Add New
              </Button>
            )}
          </>
        )}
      />
    </div>
  )
}

export default TestSuiteList
