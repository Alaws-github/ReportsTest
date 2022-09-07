import { Row, Button, Space } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useMousetrap } from '../../Hooks/index'

const TestCaseNavigator = ({
  nextTestCase,
  previousTestCase,
  currentIndex,
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
        marginTop: 25,
      }}
      justify="center"
      wrap={false}
    >
      <Space size="middle">
        <Button
          disabled={currentIndex === 0}
          onClick={previousTestCase}
          size="large"
          style={{ width: 200 }}
        >
          <Row align="middle" justify="start">
            <Space size={40}>
              <ArrowLeftOutlined />
              Previous
            </Space>
          </Row>
        </Button>
        <Button onClick={nextTestCase} size="large" style={{ width: 200 }}>
          <Row align="middle" justify="end">
            <Space size={60}>
              Next
              <ArrowRightOutlined />
            </Space>
          </Row>
        </Button>
      </Space>
    </Row>
  )
}

export default TestCaseNavigator
