import { Card, Row, Col, Grid } from 'antd'
const { useBreakpoint } = Grid
const RCard = ({ title, children }) => {
  const { xs, sm } = useBreakpoint()
  return (
    <Card
      style={{
        position: 'relative',
      }}
      title={title}
      className="shadow-sm no-scroll"
    >
      <Row>
        <Col
          style={{
            overflowY: 'auto',
            height: xs ? '100%' : 'calc(100vh - 23em)',
            minHeight: 'calc(100vh - 23em)',
            minWidth: '100%',
          }}
        >
          {children}
        </Col>
      </Row>
    </Card>
  )
}

export default RCard
