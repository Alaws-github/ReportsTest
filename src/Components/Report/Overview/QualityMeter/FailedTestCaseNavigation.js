import { Row, Button, Space, Tooltip, Typography, Col } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
const { Text } = Typography
const FailedTestCaseNavigation = ({
  currentPage,
  navigate,
  failedTestCases,
}) => {
  return (
    <Row
      style={{
        alignItems: 'center',
        width: '100%',
        margin: '.5rem 0',
      }}
      justify="center"
    >
      <Col>
        <Space>
          <Tooltip title="Previous">
            <Button
              onClick={() => navigate('previous')}
              icon={<LeftOutlined />}
              disabled={Math.ceil(failedTestCases?.length / 4) === 1}
              type="text"
              size="large"
            />
          </Tooltip>
          <Text
            style={{
              fontSize: '1rem',
            }}
          >
            {currentPage}
          </Text>
          <Tooltip title="Next">
            <Button
              onClick={() => navigate('next')}
              icon={<RightOutlined />}
              disabled={Math.ceil(failedTestCases?.length / 4) === 1}
              type="text"
              size="large"
            />
          </Tooltip>
        </Space>
      </Col>
    </Row>
  )
}

export default FailedTestCaseNavigation
