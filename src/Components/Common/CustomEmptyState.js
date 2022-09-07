import { Empty } from 'antd'

const CustomEmptyState = ({ text, style }) => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={text}
      style={{ ...style }}
    />
  )
}

export default CustomEmptyState
