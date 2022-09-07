import { Row, Space, Tag, Divider, Button, Popconfirm, Typography } from 'antd'
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import ViewerTooltip from '../../Common/ViewerTooltip'
const { Text } = Typography
export const Section = ({
  record,
  triggerSectionTestCase,
  triggerSectionUpdate,
  deleteSection,
  isViewer,
}) => {
  return (
    <Row
      type="flex"
      align="middle"
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Space>
        <b>{record?.name}</b>
        <Tag>{`${record?.children?.length || 0}`}</Tag>
      </Space>
      <Space split={<Divider type="vertical" />}>
        <ViewerTooltip title={`Add test case to section`} isViewer={isViewer}>
          <Button
            size="small"
            style={{
              border: 'none',
              backgroundColor: 'transparent',
            }}
            icon={<PlusCircleOutlined />}
            onClick={() => triggerSectionTestCase(record)}
            className="icon-light-gray"
            disabled={isViewer}
          />
        </ViewerTooltip>

        <ViewerTooltip isViewer={isViewer} title={`Edit section`}>
          <Button
            size="small"
            style={{
              border: 'none',
              backgroundColor: 'transparent',
            }}
            icon={<EditOutlined />}
            onClick={() => triggerSectionUpdate(record)}
            className="icon-light-gray"
            disabled={isViewer}
          />
        </ViewerTooltip>

        <ViewerTooltip isViewer={isViewer} title={`Delete section`}>
          <Popconfirm
            disabled={isViewer}
            onConfirm={() => {
              deleteSection(record?.id)
            }}
            placement="right"
            title={
              <div style={{ maxWidth: 250 }}>
                <Text>{`Are you sure this Section should be deleted [${record?.name}]?`}</Text>
                <br />
                <Text type="danger">
                  Note: All Test Cases under this Section will also be deleted.
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
  )
}
