import { Row, Tag, Button, Typography, Table, Empty, Col } from 'antd'
import Icon from '@ant-design/icons'
import { RiCloseCircleFill } from 'react-icons/ri'
import EllisTooltip from '../../../Common/EllipsisTooltip'
import { useMedia } from '../../../../Hooks'
const { Text } = Typography
const HighPriorityFailedTestCaseList = ({
  failedTestCases,
  setCurrentTestCase,
  setShowTestCase,
  currentPage,
}) => {
  const titleWidth = useMedia(
    [
      '(min-width: 1500px)',
      '(min-width: 1000px)',
      '(min-width: 600px)',
      '(max-width: 600px)',
    ],
    ['150px', '120px', '200px', '200px'],
    '250px'
  )
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Row gutter={[8, 8]} justify="center">
          <Col xs={3} sm={5}>
            <Icon
              style={{
                fontSize: '1.5rem',
                color: 'red',
              }}
              component={RiCloseCircleFill}
            />
          </Col>
          <Col span={14}>
            <div
              style={{
                whiteSpace: 'nowrap',
                maxWidth: titleWidth,
                fontSize: '.9rem',
              }}
            >
              <EllisTooltip title={text}>{text}</EllisTooltip>
            </div>
          </Col>
          <Col span={5}>
            <Tag color={'red'}>Failed</Tag>
          </Col>
        </Row>
      ),
    },
    {
      title: 'View',
      dataIndex: 'testRunId',
      key: 'testRunId',
      render: (id, data) => (
        <Button
          id={id}
          onClick={() => {
            setCurrentTestCase(data)
            setShowTestCase(true)
          }}
          type="link"
        >
          <Text underline>View test case</Text>
        </Button>
      ),
    },
  ]

  return (
    <div>
      {failedTestCases && failedTestCases?.length !== 0 ? (
        <Table
          showHeader={false}
          columns={columns}
          dataSource={failedTestCases}
          pagination={{
            position: ['none', 'none'],
            pageSize: 4,
            defaultCurrent: 1,
            current: currentPage,
          }}
          style={{
            width: '100%',
            overflow: 'auto',
            paddingX: '2px',
          }}
        />
      ) : (
        <Empty style={{ marginTop: 70 }} />
      )}
    </div>
  )
}

export default HighPriorityFailedTestCaseList
