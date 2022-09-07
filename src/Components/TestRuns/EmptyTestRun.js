import { Empty, Button } from 'antd'
import NotFound from '../../assets/create-green.svg'
import ViewerTooltip from '../Common/ViewerTooltip'
import { useUser } from '../../Context/UserContext'
const EmptyTestRun = ({ onClick }) => {
  const { isViewer } = useUser()
  return (
    <Empty
      image={NotFound}
      imageStyle={{
        height: 250,
        marginTop: 100,
      }}
      description={
        <div>
          <p className="text-accent-color">There are no test runs here!</p>
          <p className="text-accent-color">
            To get started, click on the new test run button!
          </p>
          <p className="text-accent-color">Happy Testing!</p>
        </div>
      }
    >
      <ViewerTooltip isViewer={isViewer}>
        <Button disabled={isViewer} onClick={onClick} type="light">
          {' '}
          New Test Run
        </Button>
      </ViewerTooltip>
    </Empty>
  )
}

export default EmptyTestRun
