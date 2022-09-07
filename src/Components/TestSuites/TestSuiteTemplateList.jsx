import React from 'react'
import { Card, Col } from 'antd'

const gridStyle = {
  width: '25%',
  textAlign: 'center',
  cursor: 'pointer',
}

const TestSuiteTemplateList = ({ dataSource, onSelect, ...rest }) => {
  return (
    <Card>
      {dataSource.map((source) => {
        return (
          <Card.Grid style={gridStyle}>
            <Col onClick={onSelect}>
              <img
                style={{
                  width: '100%',
                  height: 80,
                }}
                alt={`${source.title} test suite template`}
                src={source.icon}
              />
              <p style={{ paddingTop: 10 }}>{source.title}</p>
            </Col>
          </Card.Grid>
        )
      })}
    </Card>
  )
}

export default TestSuiteTemplateList
