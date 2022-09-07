import { Empty, Typography, Button } from 'antd'
import { useHistory } from 'react-router-dom'
const { Text } = Typography
const NoPageMatch = () => {
  const history = useHistory()
  return (
    <Empty
      image="/image/404.svg"
      imageStyle={{
        height: 350,
      }}
      description={
        <div>
          <Text type="secondary">
            Sorry, the page you visited does not exist.
          </Text>
        </div>
      }
    >
      <Button onClick={() => history.push('/')} type="primary">
        Back to Home
      </Button>
    </Empty>
  )
}

export default NoPageMatch
