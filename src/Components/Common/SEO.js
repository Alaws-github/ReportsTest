import { Helmet } from 'react-helmet'
import React from 'react'
const Seo = ({ title, description = '' }) => {
  return (
    <Helmet
      htmlAttributes={{ lang: 'en' }}
      title={`${title} | QualityWatcher App`}
      meta={[
        {
          name: 'description',
          content: description,
        },
        {
          name: 'robots',
          content: 'noindex',
        },
      ]}
    />
  )
}
export default Seo
