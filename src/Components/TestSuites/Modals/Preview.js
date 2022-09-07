import { Card, Row, Col, Tag, Empty } from 'antd'
import React from 'react'

function Preview({ preview }) {
    return (
        <div>
            {preview ?
                <Card className="shadow-sm" title="Preview">
                    <p>{preview && preview.title}</p>
                    <Row>
                        <Col>
                           {preview.priority && <Tag color="blue">
                                {preview.priority}
                            </Tag>}

                            {preview.section && <Tag color="red">
                                {preview.section}
                            </Tag>}

                            {preview.category && <Tag color="green">
                                {preview.category}
                            </Tag>}
                        </Col>
                    </Row>

                    <h6>Preconditions</h6>
                    <p>{preview && preview.precondition}</p>
                    <h6>Steps</h6>
                    <p>{preview && preview.body}</p>


                    <h6>Expected Results</h6>
                    <p style={{
                        whiteSpace: 'pre',
                        overflowWrap: 'break-word'
                    }}>{preview && preview.expectedResults}</p>
                </Card> :
                <Empty description="Select a test case to preview" />}
        </div>
    )
}

export default Preview
