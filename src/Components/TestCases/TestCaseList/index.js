import React, { useRef, useCallback } from 'react'
import { Table, Tag, Row, Col, Popconfirm, Button, Space, Tooltip } from 'antd'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import { isGPT3Enabled, flatten } from '../../../Util/util'
import CustomEmptyState from '../../Common/CustomEmptyState'
import ViewerTooltip from '../../Common/ViewerTooltip'
import { QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { TestCaseFilter } from '../TestCaseFilter'
import { TitleSearch } from '../TitleSearch'
import { useTestCasesMutation } from '../../../Util/API/TestCases/index'
import { Notification } from '../../Common/Feedback'
import { Section } from './Section'
import { TestCase } from './TestCase'

function TestCaseList({
  testSuiteInfo,
  loading,
  testCases,
  setTestCases,
  setShowNewTestCase,
  setLoading,
  selectedTestCases,
  setCurrentTestCase,
  setSelectedTestCases,
  currentTestCase,
  deleteTestCase,
  setShowGenerateTestCase,
  isViewer,
  triggerSectionTestCase,
  numberOfTests,
  triggerSectionUpdate,
  deleteSection,
  setCurrentSection,
  duplicateTestCase,
  onSearch,
  onFilterChange,
  options,
  filters,
}) {
  const { updateTestCaseIndex } = useTestCasesMutation()

  const type = 'DraggableBodyRow'

  const DraggableBodyRow = ({
    index,
    moveRow,
    className,
    style,
    ...restProps
  }) => {
    const ref = useRef()
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: (monitor) => {
        const { index: dragIndex } = monitor.getItem() || {}
        if (dragIndex === index) {
          return {}
        }
        const _testCases = flatten([], testCases)
        const dragTestCase = _testCases.find((tc) => tc.key === dragIndex)
        const dropTestCase = _testCases.find((tc) => tc.key === index)
        return {
          isOver: monitor.isOver(),
          dropClassName:
            dragTestCase?.index < dropTestCase?.index
              ? ' drop-over-downward'
              : ' drop-over-upward',
        }
      },
      drop: (item) => {
        moveRow(item.index, index)
      },
    })
    const [, drag] = useDrag({
      type,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: typeof index !== 'string' && !isViewer,
    })
    drop(drag(ref))

    return (
      <tr
        ref={ref}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{ cursor: 'pointer', ...style }}
        {...restProps}
      />
    )
  }

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  }
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      let prevIndex
      let nextIndex
      let dropIndex
      let sectionId

      const _testCases = flatten([], testCases)

      const hoverCase = _testCases.find(
        (testCase) => testCase.key === hoverIndex
      )

      const dropKey = hoverIndex
      const testCaseId = dragIndex
      const testCaseSection = hoverCase?.section
      const isSection = testCaseSection || hoverCase.type === 'section'

      sectionId = testCaseSection || hoverCase?.id

      if (isSection) {
        const sectionTestCases = _testCases.filter(
          (testCase) => testCase?.section === sectionId
        )
        //find index of dropKey
        dropIndex = sectionTestCases.findIndex(
          (testCase) => testCase.key === dropKey
        )

        prevIndex = sectionTestCases?.[dropIndex - 1]?.index || null
        nextIndex = sectionTestCases?.[dropIndex + 1]?.index || null
      } else {
        // get cases not in section
        dropIndex = testCases.findIndex((testCase) => testCase.key === dropKey)
        prevIndex = testCases?.[dropIndex - 1]?.index || null
        nextIndex = testCases?.[dropIndex + 1]?.index || null
        sectionId = null
      }

      updateTestCaseIndex({
        testCaseId,
        sectionId,
        prevIndex,
        nextIndex,
      }).catch(() => {
        Notification(
          'error',
          'Unable to move test case.',
          'Please try again later.'
        )
      })
    },
    [testCases]
  )

  const columns = [
    {
      title: (
        <Row justify="space-between">
          <div>Title</div>
          <Space
            style={{
              marginTop: '-1rem',
              marginBottom: '-1rem',
            }}
          >
            <TestCaseFilter
              filters={filters}
              options={options}
              onFilterChange={onFilterChange}
            />
            <TitleSearch value={filters?.search} onSearch={onSearch} />
          </Space>
        </Row>
      ),
      render: (text, record, index) => {
        if (record?.type === 'section') {
          return (
            <Section
              record={record}
              triggerSectionTestCase={triggerSectionTestCase}
              triggerSectionUpdate={triggerSectionUpdate}
              deleteSection={deleteSection}
              isViewer={isViewer}
            />
          )
        } else {
          const isActive = record.id === currentTestCase?.id
          return (
            <TestCase
              record={record}
              isActive={isActive}
              filters={filters}
              isViewer={isViewer}
              duplicateTestCase={duplicateTestCase}
              deleteTestCase={deleteTestCase}
            />
          )
        }
      },
      dataIndex: 'key',
      key: 'key',
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedTestCases.map((sr) => sr.id),
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedTestCases(selectedRows.filter((sr) => !sr?.type))
    },
  }

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Table
          locale={{
            emptyText: (
              <CustomEmptyState
                style={{
                  margin: '12.2rem',
                }}
                text="No test case/s found"
              />
            ),
          }}
          rowKey="id"
          className="shadow-sm"
          rowClassName={(record, index) =>
            record?.id === currentTestCase?.id ? 'selectedRow' : ''
          }
          pagination={false}
          bordered
          loading={loading}
          title={() => {
            return (
              <>
                <Row
                  gutter={[16, 16]}
                  justify="end"
                  style={{ paddingBottom: '10px' }}
                >
                  <Col>
                    {selectedTestCases.length > 0 && !isViewer ? (
                      <div>
                        <Tooltip title="Delete test case">
                          <Popconfirm
                            onConfirm={() => {
                              setLoading(true)
                              deleteTestCase({
                                testCaseIds: selectedTestCases.map(
                                  (stc) => stc?.id
                                ),
                              })
                            }}
                            placement="left"
                            title={
                              <div style={{ maxWidth: 250 }}>
                                <Text>
                                  Are you sure you want to delete these Test
                                  Cases?
                                </Text>
                                <br />
                                <Text type="danger">
                                  Note: Test cases will be deleted from any test
                                  run they are being used in.
                                </Text>
                              </div>
                            }
                            icon={
                              <QuestionCircleOutlined
                                style={{ color: 'red' }}
                              />
                            }
                          >
                            <Button size="small" danger>
                              Delete{' '}
                            </Button>
                            {` `}
                            <span>{`${selectedTestCases.length} Selected`}</span>
                          </Popconfirm>
                        </Tooltip>
                      </div>
                    ) : null}
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Row>
                      <Col>
                        <Title level={5}>
                          {testSuiteInfo?.title}
                        </Title>
                      </Col>
                      <Col
                        style={{
                          marginLeft: 3,
                        }}
                      >
                        <Tag>{numberOfTests}</Tag>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={16}>
                    <Row
                      justify="end"
                      align="middle"
                      style={{
                        warp: 'nowrap',
                        marginTop: '-.5rem',
                      }}
                    >
                      <div>
                        {isGPT3Enabled() && (
                          <ViewerTooltip
                            isViewer={isViewer}
                            title={
                              'Use QualityWatcher AI to auto-generate Test Cases from requirements.'
                            }
                          >
                            <Button
                              disabled={isViewer}
                              size="middle"
                              style={{
                                marginRight: 8,
                              }}
                              icon={<PlusOutlined />}
                              onClick={() => {
                                setShowGenerateTestCase(true)
                              }}
                            >
                              Generate Test Cases
                            </Button>
                          </ViewerTooltip>
                        )}
                        <ViewerTooltip
                          isViewer={isViewer}
                          title={
                            'Sections can be used to organize Test Cases into groups. This makes it easy to identify related Test Cases.'
                          }
                        >
                          <Button
                            disabled={isViewer}
                            size="middle"
                            onClick={() => {
                              triggerSectionUpdate(null)
                            }}
                            icon={<PlusOutlined />}
                            style={{
                              marginRight: 8,
                            }}
                          >
                            New Section
                          </Button>
                        </ViewerTooltip>
                        <ViewerTooltip isViewer={isViewer} title="">
                          <Button
                            disabled={isViewer}
                            size="middle"
                            onClick={() => {
                              setCurrentSection(null)
                              setShowNewTestCase(true)
                            }}
                            icon={<PlusOutlined />}
                            type="primary"
                          >
                            New Test Case
                          </Button>
                        </ViewerTooltip>
                      </div>
                    </Row>
                  </Col>
                </Row>
              </>
            )
          }}
          scroll={{
            y: 'calc(100vh - 25em)',
          }}
          style={{
            height: 'calc(100vh - 12em)',
            backgroundColor: 'white',
          }}
          columns={columns}
          dataSource={testCases}
          showHeader={true}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
            checkStrictly: false,
          }}
          expandable={{
            defaultExpandAllRows: true,
          }}
          components={components}
          rowIndex="key"
          onRow={(record) => {
            return {
              index: record.key,
              moveRow,
              onClick: (event) => {
                if (
                  JSON.stringify(event.target.className).includes('ant') &&
                  record?.type !== 'section'
                ) {
                  if (currentTestCase?.id !== record.id) {
                    setCurrentTestCase(record)
                  } else {
                    setCurrentTestCase(null)
                  }
                }
              },
            }
          }}
          footer={() => ''}
        />
      </DndProvider>
    </div>
  )
}

export default TestCaseList
