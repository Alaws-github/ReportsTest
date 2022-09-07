import { Row, Button, Space, Typography } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useMousetrap } from '../../../../Hooks'

const { Text } = Typography

const TestCaseNavigator = ({
  nextTestCase,
  previousTestCase,
  currentIndex,
  totalTestCases,
}) => {
  useMousetrap(['up', 'left'], () => {
    previousTestCase()
    return false
  })

  useMousetrap(['down', 'right'], () => {
    nextTestCase()
    return false
  })
  return (
    <Row
      style={{
        marginTop: 8,
        alignItems: 'center',
      }}
      justify="space-between"
      wrap={false}
    >
      <Button onClick={previousTestCase} size="large" style={{ width: 200 }}>
        <Row align="middle" justify="start">
          <Space size={40}>
            <ArrowLeftOutlined />
            Previous
          </Space>
        </Row>
      </Button>
      <Text>{`${currentIndex + 1} of ${totalTestCases}`}</Text>
      <Button onClick={nextTestCase} size="large" style={{ width: 200 }}>
        <Row align="middle" justify="end">
          <Space size={60}>
            Next
            <ArrowRightOutlined />
          </Space>
        </Row>
      </Button>
    </Row>
  )
}

export default TestCaseNavigator
