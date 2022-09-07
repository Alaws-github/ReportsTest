import React from 'react'
import { Input } from 'antd'

const Search = Input.Search

export const TitleSearch = ({ onSearch, value, ...props }) => (
  <div {...props}>
    <Search
      placeholder="Search by title"
      onSearch={onSearch}
      value={value}
      onChange={(e) => {
        e.preventDefault()
        onSearch(e.target.value)
      }}
      style={{ width: '15rem' }}
      allowClear={true}
    />
  </div>
)
