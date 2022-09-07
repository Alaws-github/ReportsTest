import { Spin, Row } from 'antd'

const PageLoader = () => (
  <Row
    type="flex"
    style={{
      marginTop: '200px',
      textAlign: 'center',
      justifyContent: 'center',
    }}
  >
    <Spin />
  </Row>
)

export default PageLoader
