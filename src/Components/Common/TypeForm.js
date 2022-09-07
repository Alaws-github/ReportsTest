import React from 'react'
import { ReactTypeformEmbed } from 'react-typeform-embed'

const EmbeddedTypeform = (
  { link, hideFooter = true, hideHeaders = true, opacity = 90, onSubmit },
  ref
) => {
  return (
    <ReactTypeformEmbed
      style={{ borderRadius: '25px', display: 'none' }}
      popup
      hideFooter={hideFooter}
      hideHeaders={hideHeaders}
      opacity={opacity}
      ref={ref}
      url={link}
      onSubmit={onSubmit}
    />
  )
}
export default React.forwardRef(EmbeddedTypeform)
