import React, { useState, useRef } from 'react'
import { Tooltip } from 'antd'

const EllipsisTooltip = ({ title, children, alwaysShow, ...rest }) => {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef(null)
  const handleVisibleChange = (visible) => {
    if (alwaysShow === true) {
      visible ? setVisible(true) : setVisible(false)
    } else {
      if (visible) {
        if (
          containerRef.current.clientWidth < containerRef.current.scrollWidth
        ) {
          setVisible(true)
        }
      } else {
        setVisible(false)
      }
    }
  }
  return (
    <Tooltip
      {...rest}
      visible={visible}
      onVisibleChange={handleVisibleChange}
      title={title}
      overlayStyle={{
        color: 'white',
        width: 600,
      }}
    >
      <div
        ref={containerRef}
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </Tooltip>
  )
}
export default EllipsisTooltip
