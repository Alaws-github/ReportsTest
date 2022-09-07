import { Button, Row } from 'antd'
const ModalFooter = ({
  loading,
  current,
  steps,
  pervious,
  next,
  success,
  enableButton,
  doneDisabled,
}) => (
  <Row
    justify="end"
    style={{
      marginTop: '8px',
    }}
  >
    {current > 0 && (
      <Button style={{ margin: '0 8px' }} onClick={() => pervious()}>
        Previous
      </Button>
    )}
    {current < steps.length - 1 && (
      <Button disabled={enableButton} type="primary" onClick={() => next()}>
        Next
      </Button>
    )}
    {current === steps.length - 1 && (
      <Button
        loading={loading}
        disabled={doneDisabled}
        type="primary"
        form="test-suite"
        htmlType="submit"
      >
        Done
      </Button>
    )}
  </Row>
)
export default ModalFooter
