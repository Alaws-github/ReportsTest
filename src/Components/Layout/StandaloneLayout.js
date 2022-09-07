import React from 'react'
import { Layout, Row, Col } from 'antd'
import './style.css'
import { useHistory } from 'react-router-dom'

const StandaloneLayout = ({ children, noPadding = false }) => {
  const history = useHistory()
  const { Content } = Layout

  return (
    <>
      <Layout style={{ minHeight: '100vh', width: '100%' }}>
        <Layout className="site-layout">
          <Row style={{ backgroundColor: '#001628', height: 46 }}>
            <Col md={2}>
              <div
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => history.push('/')}
                className="logo"
              />
            </Col>
          </Row>
          <Content
            style={{
              padding: noPadding ? 0 : 24,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default StandaloneLayout
