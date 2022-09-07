import React from 'react'
import { Card, Row, Col, Alert, Divider, Empty, Button } from 'antd'
import './style.css'
function StepOneContent({
  templates,
  onSelect,
  selectedSuite,
  onCustomSuiteSelected,
  onNext,
}) {
  const gridStyle = {
    width: '15%',
    textAlign: 'center',
    cursor: 'pointer',
  }

  return (
    <div>
      <div style={{ paddingTop: 8 }}>
        <Alert
          message="Select a predefined template and we will generate test cases based on your selection."
          type="info"
          showIcon
        />
      </div>
      <Row justify="center" style={{ paddingTop: '20px' }}>
        {templates?.map((item) => {
          return (
            <Card.Grid
              onClick={() => {
                onSelect(item)
              }}
              className={item.id === selectedSuite ? 'card-active' : ''}
              style={{ ...gridStyle }}
            >
              <Col>
                <img
                  style={{
                    width: '100%',
                    height: 80,
                  }}
                  alt={`${item.title} test suite template`}
                  src={item.icon}
                />
                <p style={{ paddingTop: 10 }}>{item.title}</p>
              </Col>
            </Card.Grid>
          )
        })}
      </Row>
      <Divider>OR</Divider>
      <Row
        justify="center"
        style={{
          cursor: 'pointer',
        }}

      >
        <Card.Grid style={{ width: '300px' }} onClick={onCustomSuiteSelected}>
          <Empty description="Create Your Own" />
        </Card.Grid>
      </Row>
      <Row
        justify="end"
        style={{
          marginTop: '8px',
        }}
      >
        <Button onClick={onNext} disabled={!selectedSuite} type="primary">
          Next
        </Button>
      </Row>
    </div>
  )
}

export default React.memo(StepOneContent)
