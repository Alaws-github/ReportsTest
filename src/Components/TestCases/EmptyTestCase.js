import React from 'react'
import { useHistory } from 'react-router-dom'
import { Empty, Button, PageHeader } from 'antd'
import ViewerTooltip from '../Common/ViewerTooltip'
import { useUser } from '../../Context/UserContext'
function EmptyTestCase({ onClick, loading }) {
  let history = useHistory()
  const { isViewer } = useUser()
  return (
    <>
      <PageHeader
        onBack={() => history.goBack()}
        title="Return To Test Suites"
      />
      <Empty
        image="/image/blank-state-icon.svg"
        imageStyle={{
          height: 300,
          marginTop: 100,
        }}
        description={
          <div>
            <p className="text-accent-color">
              Oh no! There are no test cases here!
            </p>
            <p className="text-accent-color">
              Add a test case by clicking the button below
            </p>
          </div>
        }
      >
        <ViewerTooltip isViewer={isViewer}>
          <Button disabled={loading | isViewer} onClick={onClick} type="light">
            {' '}
            Add Test Case
          </Button>
        </ViewerTooltip>
      </Empty>
    </>
  )
}

export default EmptyTestCase
