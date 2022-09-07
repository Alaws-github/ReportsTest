import { Empty, Button } from 'antd'
import ViewerTooltip from '../Common/ViewerTooltip'
import { useUser } from '../../Context/UserContext'

const EmptyTestSuite = ({ onClick, loading }) => {
  const { isViewer } = useUser()
  return (
    <Empty
      image="/image/blank-state-icon.svg"
      imageStyle={{
        height: 300,
        marginTop: 100,
      }}
      description={
        <div>
          <p className="text-accent-color">
            Oh no! There are no test suites here!
          </p>
          <p className="text-accent-color">
            To get started, click on the new test suite button!
          </p>
          <p className="text-accent-color">Happy Testing!</p>
        </div>
      }
    >
      <ViewerTooltip>
        <Button disabled={loading | isViewer} onClick={onClick} type="light">
          {' '}
          New Test Suite
        </Button>
      </ViewerTooltip>
    </Empty>
  )
}

export default EmptyTestSuite
