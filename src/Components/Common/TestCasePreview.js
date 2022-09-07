import React, { useState } from 'react'
import MarkdownPreviewBlock from './MarkdownPreviewBlock'
import {
  Card,
  Row,
  Col,
  Tag,
  Empty,
  Typography,
  Space,
  Image,
  Button,
} from 'antd'
import PreviewReferenceModal from '../TestCases/Modal/PreviewReferenceModal'
import PreviewDefectModal from '../TestRunner/Modal/PreviewDefectModal'

const { Title, Text, Link } = Typography

function PreviewSection({ name, children }) {
  return (
    <>
      <Title level={5} style={{ marginTop: 3 }}>
        {name}{' '}
      </Title>
      <div
        style={{
          whiteSpace: 'pre-line',
        }}
      >
        {children}
      </div>
    </>
  )
}

function PreviewTitle({ name }) {
  const { Title } = Typography
  return (
    <>
      <Title level={5} style={{ marginTop: 3 }}>
        {name}
      </Title>
    </>
  )
}

function PreviewTags({ testCase, sections }) {
  if (testCase?.priority || testCase?.section || testCase?.category)
    return (
      <Row style={{ marginBottom: 2 }}>
        <Col>
          {testCase.priority && <Tag color="blue">{testCase.priority}</Tag>}

          {testCase.section && (
            <Tag color="red">
              {sections?.find((s) => s?.id === testCase?.section)?.name}
            </Tag>
          )}

          {testCase.category && <Tag color="green">{testCase.category}</Tag>}
        </Col>
      </Row>
    )

  return null
}

function Attachment({ attachment }) {
  return (
    <Image
      style={{
        marginTop: 0,
        objectFit: 'cover',
      }}
      width={125}
      height={125}
      src={attachment.url}
    />
  )
}

const TestCasePreview = ({
  testCase,
  height,
  title,
  style,
  shadow = true,
  testCaseTile,
  workspace,
  innerStyle,
  showComments = false,
  showDefect = false,
  sections,
}) => {
  const [
    referencePreviewModalVisible,
    setReferencePreviewModalVisible,
  ] = useState(false)
  const [defectPreviewModalVisible, setDefectPreviewModalVisible] = useState(
    false
  )
  return (
    <div>
      {testCase ? (
        <Card
          style={style ? style : null}
          className={`${shadow ? 'shadow-sm ' : ' '}`}
          title={title ? title : null}
        >
          <div
            style={
              innerStyle
                ? { ...innerStyle }
                : { height: height ? height : '400px', overflow: 'auto' }
            }
          >
            <Space direction="vertical" size="middle">
              {testCaseTile
                ? testCaseTile()
                : testCase.title && <PreviewTitle name={testCase.title} />}
              {<PreviewTags testCase={testCase} sections={sections} />}
              {testCase.referenceKey && (
                <PreviewSection name="Reference">
                  <Row align="middle">
                    <Link
                      href={`${testCase?.referenceUrl}`}
                      target="_blank"
                      disabled={!testCase?.referenceUrl}
                    >
                      <Button
                        type="ghost"
                        style={{
                          marginRight: 15,
                          background: '#e6f7ff',
                          color: '#096dd9',
                          borderColor: '#91d5ff',
                        }}
                      >
                        {testCase?.referenceKey}
                      </Button>
                    </Link>
                    {workspace?.user?.integrations?.length > 0 && (
                      <Text underline>
                        <Link
                          onClick={() => setReferencePreviewModalVisible(true)}
                        >
                          View reference details
                        </Link>
                      </Text>
                    )}
                  </Row>
                </PreviewSection>
              )}
              {testCase.precondition && (
                <PreviewSection name="Preconditions">
                  <MarkdownPreviewBlock value={testCase.precondition} />
                </PreviewSection>
              )}
              {testCase.body && (
                <PreviewSection name="Steps">
                  <MarkdownPreviewBlock value={testCase.body} />
                </PreviewSection>
              )}
              {testCase?.comment &&
                testCase?.comment?.length !== 0 &&
                showComments && (
                  <PreviewSection name="Actual results">
                    {testCase?.comment?.map((comment) => (
                      <MarkdownPreviewBlock value={comment?.body} />
                    ))}
                  </PreviewSection>
                )}
              {testCase.expectedResults && (
                <PreviewSection name="Expected results">
                  <MarkdownPreviewBlock value={testCase.expectedResults} />
                </PreviewSection>
              )}
              {testCase.defectKey && showDefect && (
                <PreviewSection name="Defect">
                  <Row align="middle">
                    <Link
                      href={`${testCase?.defectUrl}`}
                      target="_blank"
                      disabled={!testCase?.defectUrl}
                    >
                      <Button
                        type="ghost"
                        style={{
                          marginRight: 15,
                          background: '#fff1f0',
                          color: '#cf1322',
                          borderColor: '#ffa39e',
                        }}
                      >
                        {testCase?.defectKey}
                      </Button>
                    </Link>
                    {workspace?.user?.integrations?.length > 0 && (
                      <Text underline>
                        <Link
                          onClick={() => setDefectPreviewModalVisible(true)}
                        >
                          View defect details
                        </Link>
                      </Text>
                    )}
                  </Row>
                </PreviewSection>
              )}
              {testCase?.attachment && testCase?.attachment?.length !== 0 && (
                <PreviewSection name="Attachments">
                  <div
                    style={{
                      width: 'calc(100vh - 40em)',
                      height: '130px',
                      float: 'right',
                      overflowX: 'scoll',
                      overflowY: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Space size="small">
                      {testCase?.attachment?.map((attachment) => (
                        <Attachment attachment={attachment} />
                      ))}
                    </Space>
                  </div>
                </PreviewSection>
              )}
            </Space>
          </div>
        </Card>
      ) : (
        <Empty description="Select a test case to preview" />
      )}
      <PreviewReferenceModal
        isModalVisible={referencePreviewModalVisible}
        setModalVisible={setReferencePreviewModalVisible}
        referenceKey={testCase?.referenceKey}
      />
      <PreviewDefectModal
        isModalVisible={defectPreviewModalVisible}
        setModalVisible={setDefectPreviewModalVisible}
        defectKey={testCase?.defectKey}
      />
    </div>
  )
}

export default TestCasePreview
