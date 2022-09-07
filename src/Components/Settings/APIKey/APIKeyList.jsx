import { List, Button, Typography, Popconfirm } from 'antd'
import { utcToZonedTimeFormat } from '../../../Util/util'
const { Text } = Typography
const APIKeyList = ({ apiKeys, onDelete, isLoading }) => {
  return (
    <List
      loading={isLoading}
      itemLayout="horizontal"
      dataSource={apiKeys}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Popconfirm
              title="Are you sure you want to delete this api key?"
              onConfirm={() => {}}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
              disabled
            >
              <Button disabled type="link">
                Delete
              </Button>
            </Popconfirm>,
          ]}
        >
          <List.Item.Meta
            title={item?.api_key_name}
            description={
              <>
                <Text type="secondary">{`**************************${item?.api_key}`}</Text>
                <br />
                <Text type="secondary">{`Created on ${utcToZonedTimeFormat(
                  item?.created_at
                )}`}</Text>
              </>
            }
          />
        </List.Item>
      )}
    />
  )
}

export default APIKeyList
