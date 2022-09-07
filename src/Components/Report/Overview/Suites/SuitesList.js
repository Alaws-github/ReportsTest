import { Table } from 'antd'
import SuiteTitleWithStatsBar from '../../Suites/SuiteTitleWithStatsBar'
const SuitesList = ({ suites, onSuiteClick }) => {
  const columns = [
    {
      key: '1',
      name: 'Title',
      render: (text, record) => {
        return <SuiteTitleWithStatsBar suite={record} />
      },
    },
  ]
  return (
    <Table
      style={{
        marginTop: '.1em',
      }}
      columns={columns}
      dataSource={suites || []}
      showHeader={false}
      pagination={false}
      footer={null}
      onRow={() => {
        return {
          onClick: () => (window.location.hash = '#suites'),
        }
      }}
    />
  )
}

export default SuitesList
