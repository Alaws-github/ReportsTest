import {
  Table,
  Space,
  Tooltip,
  Skeleton,
  Popconfirm,
  Typography,
  Row,
} from 'antd'
import {
  DeleteTwoTone,
  EditTwoTone,
  PlayCircleTwoTone,
  QuestionCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Notification } from '../Common/Feedback'
import { calculateSummaryPercentages } from '../../Util/util'
import { useHistory, Link, useRouteMatch } from 'react-router-dom'
import { useTestRunsMutation } from '../../Util/API/TestRuns'
import MultiProgress from 'react-multi-progress'
import EllipsisTooltip from '../Common/EllipsisTooltip'
import { statusColors } from '../../constants'
import { useUser } from '../../Context/UserContext'
import { utcToZonedTimeFormat } from '../../Util/util'

const { Text } = Typography

const TestRunList = ({ dataSource, onEdit, loading }) => {
  const { isViewer } = useUser()
  const match = useRouteMatch()
  const projectId = match?.params?.projectId
  const history = useHistory()
  const { deleteTestRun } = useTestRunsMutation()
  const iconStyle = {
    fontSize: 22,
  }
  const columns = [
    {
      title: 'Test Run',
      dataIndex: 'title',
      width: 200,
      key: 'title',
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 200,
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
                <br />
                <br />
                <Text
                  style={{
                    color: 'white',
                  }}
                >
                  {record?.description}
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
            title={` by ${record?.author === 'null null' ? 'Admin' : record?.author
              },
              ${utcToZonedTimeFormat(record?.createdAt)}`}
          >
            <Text type="secondary">
              by {record?.author === 'null null' ? 'Admin' : record?.author},{' '}
              {utcToZonedTimeFormat(record?.createdAt)}
            </Text>
          </EllipsisTooltip>
        </div>
      ),
    },
    {
      title: 'Test Cases',
      dataIndex: 'summary',
      key: 'summary',
      align: 'center',
      width: 100,
      render: (record) => record?.case_count,
    },
    {
      title: 'Progress',
      dataIndex: 'summary',
      align: 'center',
      key: 'summary',
      width: 250,
      render: (summary, record) => {
        const percentages = calculateSummaryPercentages(summary)
        return (
          <Tooltip
            title={`${summary?.passed} passed / ${summary?.failed} failed / ${summary?.blocked}  blocked / ${summary?.skipped} skipped / ${summary?.not_executed} not executed`}
          >
            <div
              onClick={() => {
                if (record?.summary?.case_count === 0) {
                } else {
                  history.push(`/${projectId}/test-runner/${record?.customId}`)
                }
              }}
            >
              <Row wrap={false} align="middle">
                <MultiProgress
                  backgroundColor={'#EAF2F8'}
                  height={8}
                  elements={[
                    {
                      value: percentages.passed,
                      color: statusColors.passed,
                    },
                    {
                      value: percentages.failed,
                      color: statusColors.failed,
                    },
                    {
                      value: percentages.blocked,
                      color: statusColors.blocked,
                    },
                    {
                      value: percentages.skipped,
                      color: statusColors.skipped,
                    },
                    {
                      value: percentages.not_executed,
                      color: statusColors.not_executed,
                    },
                  ]}
                />
                <span style={{ marginLeft: 4 }}>{`${record?.summary?.case_count === 0
                  ? 0
                  : percentages?.completed?.toFixed(0) || ''
                  }%`}</span>
              </Row>
            </div>
          </Tooltip>
        )
      },
    },
    {
      key: 'action',
      align: 'center',
      width: 150,
      render: (record) => (
        <Space size="large">
          {record?.summary?.case_count === 0 ? (
            <Tooltip
              title={`No test cases in run, you can edit the test run to add new test cases.`}
            >
              <Link>
                <WarningOutlined style={iconStyle} />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title={`Run`}>
              <Link to={`/${projectId}/test-runner/${record?.customId}`}>
                <PlayCircleTwoTone twoToneColor="#52c41a" style={iconStyle} />
              </Link>
            </Tooltip>
          )}

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
                title="Are you sure you want to delete this test run"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => {
                  deleteTestRun(record.id)
                    .then(() => {
                      Notification('success', 'Your test run was deleted.')
                    })
                    .catch((error) => {
                      Notification(
                        'error',
                        'Unable to delete the test run. Please try again later.'
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
    <Skeleton
      paragraph={{
        rows: dataSource?.length,
        width: '100%',
      }}
      active
      loading={false}
    >
      <Table
        style={{ overflowY: 'hidden' }}
        size="large"
        className="shadow-sm"
        loading={loading}
        pagination={false}
        columns={columns}
        dataSource={[...dataSource]}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              if (JSON.stringify(event.target.className).includes('ant')) {
                if (record?.summary?.case_count === 0) {
                } else {
                  history.push(`/${projectId}/test-runner/${record?.customId}`)
                }
              }
            }, // click row
          }
        }}
      />
    </Skeleton>
  )
}

export default TestRunList
