import React from 'react'
import { Typography, Select, Space } from 'antd'
const { Option } = Select

const { Text } = Typography

export const TestCaseFilter = ({
  onFilterChange,
  options,
  filters,
  ...props
}) => {
  return (
    <div {...props}>
      <Space>
        {options?.map((option) => {
          return (
            <Select
              showArrow
              showSearch
              placeholder={`Filter by ${option?.value}`}
              optionFilterProp="children"
              onChange={(value) => {
                onFilterChange(value, option?.value)
              }}
              value={filters?.[option?.value]}
              maxTagCount="responsive"
              mode="multiple"
              style={{
                width: '10rem',
              }}
              filterOption={(input, { label }) => {
                return label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}
            >
              {option?.children?.map(({ value, label }) => {
                return (
                  <Option label={label} value={value} key={value}>
                    <Text strong>{label}</Text>
                  </Option>
                )
              })}
            </Select>
          )
        })}
      </Space>
    </div>
  )
}
