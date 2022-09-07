import { Table, Typography, Tooltip, Space, Popconfirm } from 'antd'
import {
  FolderOpenTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import EllipsisTooltip from '../Common/EllipsisTooltip'
import { useHistory, Link } from 'react-router-dom'
import { utcToZonedTimeFormat } from '../../Util/util'
import { useUser } from '../../Context/UserContext'
import { useReportServiceMutation } from '../../Util/API/Report'
import { Notification } from '../Common/Feedback'
const { Text } = Typography
const ReportsList = ({ reports, loading, projectId, onEdit, setLoading }) => {
  const { isViewer } = useUser()
  const history = useHistory()
  const { deleteReport } = useReportServiceMutation()
  const iconStyle = {
    fontSize: 22,
  }
  const columns = [
    {
      title: 'Report',
      dataIndex: 'name',
      width: 500,
      key: 'name',
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 500,
          },
        }
      },
      render: (text, record) => (
        <div>
          <EllipsisTooltip
            alwaysShow={true}
            placement="bottom"
            title={
              <div>
                <Text
                  level={5}
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {text}
                </Text>
              </div>
            }
          >
            <Text
              level={5}
              style={{
                fontWeight: 'bold',
              }}
            >
              {text}
            </Text>
          </EllipsisTooltip>
          <EllipsisTooltip
            title={` by ${
              record?.author_name === 'null null'
                ? 'Admin'
                : record?.author_name
            },
                  ${utcToZonedTimeFormat(record?.created_at)}`}
          >
            <Text type="secondary">
              by{' '}
              {record?.author_name === 'null null'
                ? 'Admin'
                : record?.author_name}
              , {utcToZonedTimeFormat(record?.created_at)}
            </Text>
          </EllipsisTooltip>
        </div>
      ),
    },
    {
      title: 'Test Run',
      dataIndex: 'test_run_name',
      key: 'test_run_name',
      render: (text) => {
        return <Text level={5}>{text}</Text>
      },
    },
    {
      key: 'action',
      title: '',
      align: 'center',
      render: (record) => (
        <Space size={'large'}>
          <Tooltip title={`Open`}>
            <Link to={`/${projectId}/reports/${record.id}`}>
              <FolderOpenTwoTone
                twoToneColor="#52c41a"
                style={{
                  fontSize: 22,
                }}
              />
            </Link>
          </Tooltip>
          {!isViewer && (
            <Tooltip title={`Edit`}>
              <Link>
                <EditTwoTone
                  style={iconStyle}
                  onClick={() => {
                    onEdit(record)
                  }}
                />
              </Link>
            </Tooltip>
          )}
          {!isViewer && (
            <Link>
              <Popconfirm
                placement="right"
                title="Are you sure you want to delete this report?"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => {
                  return new Promise((resolve, reject) => {
                    deleteReport(record.id)
                      .then(() => {
                        Notification('success', 'Your report was deleted.')
                        resolve()
                      })
                      .catch(() => {
                        Notification(
                          'error',
                          'Unable to delete report. Please try again later.'
                        )
                        reject()
                      })
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
    <Table
      style={{ overflowY: 'hidden' }}
      size="large"
      className="shadow-sm"
      loading={loading}
      pagination={false}
      columns={columns}
      dataSource={reports}
      onRow={(record) => {
        return {
          onClick: (event) => {
            if (JSON.stringify(event.target.className).includes('ant')) {
              if (JSON.stringify(event.target.className).includes('popover')) {
              } else {
                history.push(`/${projectId}/reports/${record?.id}`)
              }
            }
          }, // click row
        }
      }}
    />
  )
}

export default ReportsList
