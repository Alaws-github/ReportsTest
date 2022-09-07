import {
  Row,
  Card,
  Table,
  Col,
  Collapse,
  Tag,
  Typography,
  Divider,
  Image,
  Space,
  Select,
} from 'antd'
import QualityMeter from '../Common/QualityMeter'
import { useEffect, useState } from 'react'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PaperClipOutlined,
  CommentOutlined,
} from '@ant-design/icons'
import Icon from '@ant-design/icons'
import { FaRegCircle } from 'react-icons/fa'
import { CgPlayTrackNextO } from 'react-icons/cg'
import StatusTag from '../Common/StatusTag'
import { statusColors } from '../../constants'
import { useGetTestRunQuality } from '../../Util/API/TestRunner'
import MarkdownPreviewBlock from '../Common/MarkdownPreviewBlock'
import { includes } from '@antv/util'
import { label } from 'aws-amplify'

const { Text } = Typography
const { Panel } = Collapse
const ReportSummary = ({ testRunData, testRunId }) => {
  const [selectedStatus, setSelectedStatus] = useState([])
  const { data: qualityMeter } = useGetTestRunQuality(testRunId)
  const listOfTestSuites = [
    ...new Set(testRunData?.testRunCases?.map((tc) => tc.suiteId)),
  ]
  const [testSuitesWithResults, setTestSuitesWithResults] = useState([])

  function callback(key) {
    console.log(key)
  }

  function PreviewSection({ name, children }) {
    const { Title } = Typography
    return (
      <div style={{ marginBottom: 10 }}>
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
      </div>
    )
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

  const statusData = {
    passed: {
      icon: <CheckCircleOutlined />,
      color: statusColors.passed,
    },
    failed: {
      icon: <CloseCircleOutlined />,
      color: statusColors.failed,
    },
    blocked: {
      icon: <ExclamationCircleOutlined />,
      color: statusColors.blocked,
    },
    skipped: {
      icon: <Icon component={CgPlayTrackNextO} />,
      color: statusColors.skipped,
    },
    not_executed: {
      icon: <Icon component={FaRegCircle} />,
      color: statusColors.not_executed,
    },
  }

  function handleChange(value) {
    setSelectedStatus(value.includes(',') ? [...value.split(',')] : [...value])
  }

  const options = [
    { value: 'passed', label: 'PASSED' },
    { value: 'failed', label: 'FAILED' },
    { value: 'blocked', label: 'BLOCKED' },
    { value: 'skipped', label: 'SKIPPED' },
    { value: 'not_executed', label: 'NOT EXECUTED' },
  ]

  function tagRender(props) {
    const { label, value, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        color={statusData[value].color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    )
  }

  const columns = [
    {
      title: 'Test Suite(s) and Test Case Results',
      dataIndex: 'title',
      key: 'title',
      render: (record, data) => {
        if (testSuitesWithResults) {
          const sIndex = testSuitesWithResults.findIndex(
            (sData) => sData.suiteId === data.suiteId
          )
          const suiteData = testSuitesWithResults[sIndex]
          return (
            <Row justify="space-between">
              {data.suiteTitle}{' '}
              <div>
                <Tag
                  icon={statusData?.passed?.icon}
                  color={statusData?.passed?.color}
                >
                  {suiteData?.passed?.length}
                </Tag>
                <Tag
                  icon={statusData?.failed?.icon}
                  color={statusData?.failed?.color}
                >
                  {suiteData?.failed?.length}
                </Tag>
                <Tag
                  icon={statusData?.blocked?.icon}
                  color={statusData?.blocked?.color}
                >
                  {suiteData?.blocked?.length}
                </Tag>
                <Tag
                  icon={statusData?.skipped?.icon}
                  color={statusData?.skipped?.color}
                >
                  {suiteData?.skipped?.length}
                </Tag>
                <Tag
                  icon={statusData?.not_executed?.icon}
                  color={statusData?.not_executed?.color}
                >
                  {suiteData?.not_executed?.length}
                </Tag>
              </div>
            </Row>
          )
        }
        return <>{record}</>
      },
    },
  ]

  useEffect(() => {
    if (listOfTestSuites) {
      const runData = listOfTestSuites.map((suiteId) => {
        const children = testRunData?.testRunCases?.filter(
          (trc) => trc?.suiteId === suiteId
        )

        return {
          key: suiteId,
          suiteId,
          suiteTitle: children[0].suiteTitle,
          failed: children?.filter((tc) => tc.status === 'failed'),
          passed: children?.filter((tc) => tc.status === 'passed'),
          skipped: children?.filter((tc) => tc.status === 'skipped'),
          blocked: children?.filter((tc) => tc.status === 'blocked'),
          not_executed: children?.filter((tc) => tc.status === 'not executed'),
        }
      })
      setTestSuitesWithResults(runData)
    }
  }, [])

  return (
    <div>
      <Row>
        <Col flex="auto" md={16}>
          <div>
            <Card
              title={
                <Row className="custom-header" justify="space-between">
                  <div>Test Results</div>
                  <Select
                    onChange={handleChange}
                    mode="multiple"
                    showArrow
                    tagRender={tagRender}
                    style={{ width: '50%' }}
                    placeholder="Select to filter results"
                    options={options}
                  />
                </Row>
              }
            >
              <Table
                style={{
                  overflowY: 'auto',
                  height: 'calc(100vh - 22em)',
                  backgroundColor: 'white',
                }}
                pagination={false}
                showHeader={false}
                bordered={false}
                dataSource={testSuitesWithResults}
                columns={columns}
                expandable={{
                  defaultExpandAllRows: true,
                  expandRowByClick: true,
                  expandedRowRender: (record) => {
                    const testCaseResults = testRunData?.testRunCases?.filter(
                      (trc) => {
                        if (selectedStatus.length !== 0) {
                          const status = trc?.status?.replace(' ', '_')
                          return (
                            trc?.suiteId === record.suiteId &&
                            selectedStatus.includes(status)
                          )
                        }
                        return trc?.suiteId === record.suiteId
                      }
                    )
                    return (
                      <Collapse expandIconPosition="right" onChange={callback}>
                        {testCaseResults?.map((tc, index) => {
                          return (
                            <Panel
                              header={
                                <Row>
                                  <>
                                    <StatusTag status={tc.status} />
                                    {tc.title}
                                  </>
                                  <Row justify="end" align="middle">
                                    {tc?.comment && <CommentOutlined />}
                                    {tc?.attachment && <PaperClipOutlined />}
                                  </Row>
                                </Row>
                              }
                              key={`${index + 1}`}
                            >
                              {/* Check for comments and attachments */}
                              {!tc?.comment && !tc.attachment && (
                                <Text disabled>
                                  No comment/s or attachment/s to display.
                                </Text>
                              )}

                              {tc?.comment && (
                                <>
                                  <PreviewSection name="Comment">
                                    <MarkdownPreviewBlock
                                      value={tc?.comment[0]?.body}
                                    />
                                  </PreviewSection>{' '}
                                  <Divider />
                                </>
                              )}

                              {tc?.attachment && (
                                <PreviewSection name="Attachments">
                                  <div>
                                    <Space size="small">
                                      {tc?.attachment?.map((attachment) => (
                                        <Attachment attachment={attachment} />
                                      ))}
                                    </Space>
                                  </div>
                                </PreviewSection>
                              )}
                            </Panel>
                          )
                        })}
                      </Collapse>
                    )
                  },
                }}
              />
            </Card>
          </div>
        </Col>
        <Col
          flex="auto"
          md={8}
          style={{
            marginLeft: 5,
          }}
        >
          <QualityMeter percentAmount={qualityMeter?.qualityScore / 100} />
          <Divider />
        </Col>
      </Row>
    </div>
  )
}

export default ReportSummary
