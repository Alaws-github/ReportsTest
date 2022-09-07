import { ClockCircleOutlined } from '@ant-design/icons'
import { Badge, Space, Tooltip } from 'antd'
import { msToTime } from '../../Util/util'
import { statusColors, automationToolTips } from '../../constants'

const ElapsedTime = ({ time, status }) => {
  if (!time) return null
  return (
    <Tooltip title={automationToolTips.time}>
      <Space>
        <Badge
          style={{ backgroundColor: statusColors[status] }}
          count={msToTime(time)}
        />
        <Badge
          count={
            <ClockCircleOutlined style={{ color: statusColors[status] }} />
          }
        />
      </Space>
    </Tooltip>
  )
}

export default ElapsedTime
