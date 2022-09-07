import { Typography, Row, Col } from 'antd'
import SuitesList from './SuitesList'
import RCard from '../../RCard'
const { Text } = Typography
const Suites = ({ suites }) => {
  return (
    <RCard
      title={
        <>
          <Text
            style={{
              marginRight: '1em',
            }}
            level={3}
          >
            Suites Summary
          </Text>
          <Text type="secondary">
            {suites?.length || 0} suite/s in total in this test run
          </Text>
        </>
      }
    >
      <Row>
        <Col span={24}>
          <SuitesList suites={suites} />
        </Col>
      </Row>
    </RCard>
  )
}

export default Suites
