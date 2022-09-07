import { Col, Row, Space, Tag, Typography, Divider, Popconfirm } from 'antd'
import {
  MenuOutlined,
  CopyOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import ViewerTooltip from '../../Common/ViewerTooltip'
import Highlighter from 'react-highlight-words'
const { Text } = Typography

export const TestCase = ({
  record,
  isActive,
  filters,
  isViewer,
  duplicateTestCase,
  deleteTestCase,
}) => {
  const renderLabel = (label) => {
    let searchString = filters?.search || ''
    return (
      <Highlighter
        highlightClassName="searchString"
        searchWords={[searchString]}
        autoEscape={true}
        textToHighlight={label}
        highlightStyle={{
          backgroundColor: 'whitesmoke',
        }}
      />
    )
  }
  return (
    <div
      data-type="tc"
      data-typeId={record.id}
      className={isActive ? 'active-test-row' : ''}
    >
      <Row align="middle">
        <Col md={23}>
          <span>
            <Space>
              <Tag color="blue">{record.customId}</Tag>
              <Text>{renderLabel(record.title)}</Text>
            </Space>
          </span>
        </Col>
        <Col md={1}>
          <Row justify="end">
            <Space split={<Divider type="vertical" />}>
              <ViewerTooltip isViewer={isViewer} title="">
                <MenuOutlined
                  className="drag-handle icon-light-gray"
                  style={{ cursor: 'grab' }}
                  disabled={isViewer}
                />
              </ViewerTooltip>
              <ViewerTooltip isViewer={isViewer} title="Duplicate test case">
                <Popconfirm
                  disabled={isViewer}
                  onConfirm={() => {
                    duplicateTestCase(record)
                  }}
                  placement="right"
                  title={
                    <div style={{ maxWidth: 250 }}>
                      <Text>
                        Are you sure you want to duplicate this Test Case?
                      </Text>
                    </div>
                  }
                  icon={<QuestionCircleOutlined />}
                >
                  <CopyOutlined
                    disabled={isViewer}
                    className="icon-light-gray"
                  />
                </Popconfirm>
              </ViewerTooltip>
              <ViewerTooltip isViewer={isViewer} title="Delete test case">
                <Popconfirm
                  disabled={isViewer}
                  onConfirm={() => {
                    deleteTestCase({ testCaseIds: [record.id] })
                  }}
                  placement="right"
                  title={
                    <div style={{ maxWidth: 250 }}>
                      <Text>
                        Are you sure you want to delete this Test Case?
                      </Text>
                      <br />
                      <Text type="danger">
                        Note: Test case will be deleted from any test run it is
                        being used in.
                      </Text>
                    </div>
                  }
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                >
                  <DeleteOutlined disabled={isViewer} className="delete-btn" />
                </Popconfirm>
              </ViewerTooltip>
            </Space>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
