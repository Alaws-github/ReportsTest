import { Row, Button } from 'antd'
const Footer = () => {
  return (
    <Row
      style={{
        fontSize: '0.75rem',
        lineHeight: '1rem',
        color: '#fff',
        zIndex: '10',
      }}
      justify="space-between"
      align="middle"
    >
      <div>&copy; QualityWatcher 2022</div>
      <Button
        style={{
          color: '#fff',
        }}
        type="text"
        href="mailto:contact@qualitywatcher.com"
      >
        Contact us
      </Button>
    </Row>
  )
}

export default Footer
