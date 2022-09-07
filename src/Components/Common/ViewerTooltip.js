import { Tooltip } from 'antd'

const ViewerTooltip = ({ children, isViewer, title }) => (
  <Tooltip
    title={
      isViewer
        ? `Your role does not grant you permission to perform this action.`
        : title || ''
    }
  >
    {children}
  </Tooltip>
)

export default ViewerTooltip
