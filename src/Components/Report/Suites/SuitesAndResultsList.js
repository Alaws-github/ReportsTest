import { Collapse, Table, Space } from 'antd'
import { UpOutlined } from '@ant-design/icons'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  RightCircleFilled,
  MinusCircleFilled,
} from '@ant-design/icons'
import Icon from '@ant-design/icons'
import { statusColors } from '../../../constants'

import SuiteTitleWithStatsBar from './SuiteTitleWithStatsBar'
const { Panel } = Collapse
const SuitesAndResultsList = ({
  suites,
  setCurrentSections,
  setCurrentTestCase,
  currentSections,
  selectedStatus,
  currentTestCase,
}) => {
  const statusData = {
    passed: {
      icon: (
        <CheckCircleFilled
          style={{
            color: statusColors.passed,
            fontSize: '1.5rem',
          }}
        />
      ),
      color: statusColors.passed,
    },
    failed: {
      icon: (
        <CloseCircleFilled
          style={{
            color: statusColors.failed,
            fontSize: '1.5rem',
          }}
        />
      ),
      color: statusColors.failed,
    },
    blocked: {
      icon: (
        <ExclamationCircleFilled
          style={{
            color: statusColors.blocked,
            fontSize: '1.5rem',
          }}
        />
      ),
      color: statusColors.blocked,
    },
    skipped: {
      icon: (
        <Icon
          component={RightCircleFilled}
          style={{
            color: statusColors.skipped,
            fontSize: '1.5rem',
          }}
        />
      ),
      color: statusColors.skipped,
    },
    'not executed': {
      icon: (
        <Icon
          style={{
            fontSize: '1.5rem',
            color: statusColors.not_executed,
          }}
          component={MinusCircleFilled}
        />
      ),
      color: statusColors.not_executed,
    },
  }
  const columns = [
    {
      title: 'Test Case',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => {
        const isActive = record.id === currentTestCase?.id
        return (
          <div
            style={{
              marginLeft: '2rem',
            }}
            data-type="tc"
            data-typeId={record?.id}
            className={isActive ? 'active-test-row' : ''}
          >
            <Space>
              {statusData[record.status].icon}
              {text}
            </Space>
          </div>
        )
      },
    },
  ]
  return (
    <Collapse
      expandIconPosition="right"
      bordered={false}
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) => <UpOutlined rotate={isActive ? 0 : 180} />}
    >
      {suites?.map((suite, index) => {
        const testCases =
          selectedStatus?.length === 0
            ? suite?.testCases
            : suite?.testCases?.filter((tc) => {
                const status = tc?.status?.replace(' ', '_')
                if (
                  selectedStatus?.includes('high_priority') &&
                  selectedStatus?.length === 1
                ) {
                  return tc?.priority === 'P1'
                }

                if (
                  selectedStatus?.includes('high_priority') &&
                  selectedStatus?.length > 1
                ) {
                  const isHP = tc?.priority === 'P1'
                  return isHP && selectedStatus?.includes(status)
                }
                return selectedStatus?.includes(status)
              })

        return (
          <Panel
            header={
              <div
                style={{
                  marginLeft: '2rem',
                }}
              >
                <SuiteTitleWithStatsBar
                  showIsHighPriorityFailedText={false}
                  suite={suite}
                />
              </div>
            }
            key={index}
          >
            <Table
              pagination={false}
              showHeader={false}
              bordered={false}
              columns={columns}
              dataSource={testCases}
              rowClassName={(record, index) =>
                record?.testCaseId === currentTestCase?.testCaseId
                  ? 'selectedRow'
                  : ''
              }
              onRow={(record) => {
                return {
                  onClick: () => {
                    if (
                      JSON.stringify(suite?.sections) !==
                      JSON.stringify(currentSections)
                    ) {
                      setCurrentSections(suite?.sections)
                    }

                    setCurrentTestCase(record)
                  },
                }
              }}
            />
          </Panel>
        )
      })}
    </Collapse>
  )
}

export default SuitesAndResultsList
