import { Empty, Button } from 'antd'
import ViewerTooltip from '../Common/ViewerTooltip'

const EmptyReports = ({ onClick, loading }) => {
  return (
    <Empty
      image="/image/qw-report.svg"
      imageStyle={{
        height: 300,
        marginTop: 100,
      }}
      description={
        <div>
          <p className="text-accent-color">Oh no! There are no reports here!</p>
          <p className="text-accent-color">
            To get started, click on the Generate Report button.
          </p>
          <p className="text-accent-color">Happy reporting!</p>
        </div>
      }
    >
      <ViewerTooltip>
        <Button disabled={loading} onClick={onClick} type="light">
          {' '}
          Generate Report
        </Button>
      </ViewerTooltip>
    </Empty>
  )
}

export default EmptyReports
