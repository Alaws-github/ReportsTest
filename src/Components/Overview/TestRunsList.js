import {
  Table,
  Tooltip,
  Skeleton,
  Typography,
  Row,
  Result,
  Button,
  Card,
} from 'antd'
import { PlayCircleTwoTone, WarningOutlined } from '@ant-design/icons'
import { calculateSummaryPercentages } from '../../Util/util'
import { useHistory, Link, useRouteMatch } from 'react-router-dom'
import MultiProgress from 'react-multi-progress'
import EllipsisTooltip from '../Common/EllipsisTooltip'
import { statusColors } from '../../constants'
import { utcToZonedTimeFormat } from '../../Util/util'

import Icon from '@ant-design/icons'
import { ReactComponent as Create } from '../../assets/create-green.svg'
const { Text } = Typography

const TestRunList = ({ dataSource, onEdit }) => {
  const match = useRouteMatch()
  const projectId = match.params.projectId
  const history = useHistory()
  const iconStyle = {
    fontSize: 22,
  }
  const columns = [
    {
      title: () => <div className="custom-header">Test Run</div>,
      dataIndex: 'title',
      width: 200,
      key: 'title',
      className: 'custom-col',
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
      title: () => <div className="custom-header">Test Cases</div>,
      dataIndex: 'summary',
      key: 'summary',
      align: 'center',
      width: 100,
      className: 'custom-col',
      render: (record) => record?.case_count,
    },
    {
      title: () => <div className="custom-header">Progress</div>,
      dataIndex: 'summary',
      align: 'center',
      key: 'summary',
      width: 250,
      className: 'custom-col',
      render: (summary, record) => {
        const percentages = calculateSummaryPercentages(summary)
        return (
          <Tooltip
            title={`${summary?.passed} passed / ${summary?.failed} failed / ${summary?.blocked}  blocked / ${summary?.skipped} skipped / ${summary?.not_executed} not executed`}
          >
            <div
              onClick={() => {
                if (summary?.case_count === 0) {
                } else {
                  history.push(`/${projectId}/test-runner/${record?.customId}`)
                }
              }}
            >
              <Row wrap={false} align="middle">
                <MultiProgress
                  backgroundColor={statusColors.not_executed}
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
      className: 'custom-col',
      render: (text, record) => (
        <>
          {record?.summary?.case_count === 0 ? (
            <Tooltip
              title={`No test cases in run, you can edit the test run to add new test cases.`}
            >
              <Link to="/test-runs">
                <WarningOutlined style={iconStyle} />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title={`Go To Run`}>
              <Link to={`/${projectId}/test-runner/${record?.customId}`}>
                <PlayCircleTwoTone twoToneColor="#52c41a" style={iconStyle} />
              </Link>
            </Tooltip>
          )}
        </>
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
      {dataSource?.length === 0 ? (
        <Card
          title={<div className="custom-header">Recent test runs</div>}
          bodyStyle={{ padding: 0 }}
        >
          <Row
            style={{ height: 'calc(100vh - 38em)' }}
            justify="center"
            align="middle"
          >
            <Result
              icon={
                <Icon
                  style={{ fontSize: '200px', marginTop: -40 }}
                  component={Create}
                />
              }
              title={
                <div style={{ fontSize: 15, marginTop: -40 }}>
                  No test runs created as yet
                </div>
              }
              subTitle="Create your first test suite to initiate a test run"
              extra={
                <Link to={`/${projectId}/test-runs`}>
                  <Button size="small" type="link">
                    Go to test runs
                  </Button>
                </Link>
              }
            />
          </Row>
        </Card>
      ) : (
        <Table
          style={{
            overflowY: 'auto',
            height: 'calc(100vh - 31.5em)',
            backgroundColor: 'white',
          }}
          size="large"
          className="shadow-sm"
          loading={dataSource?.includes(undefined)}
          pagination={false}
          columns={columns}
          dataSource={dataSource}
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
      )}
    </Skeleton>
  )
}

export default TestRunList
