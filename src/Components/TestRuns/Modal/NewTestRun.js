import React, { useState, useEffect } from 'react'
import { Modal, Steps } from 'antd'
import StepOneContent from './StepOneContent'
import StepTwoContent from './StepTwoContent'
import { useTestRunsMutation } from '../../../Util/API/TestRuns'
import { Notification } from '../../Common/Feedback'
const { Step } = Steps

const NewTestRunModal = ({
  visible,
  onCancel,
  testCases,
  projectId,
  modalType,
  savedTestRunDetails,
  existingTestCases,
  workspace,
  sections,
}) => {
  const [current, setCurrent] = useState(0)
  const [testRunDetails, setTestRunDetails] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedTestCases, setSelectedTestCases] = useState([])
  const { createTestRun, updateTestRun } = useTestRunsMutation()

  useEffect(() => {
    setTestRunDetails(savedTestRunDetails)
    if (existingTestCases) {
      setSelectedTestCases(existingTestCases)
    }
  }, [savedTestRunDetails, existingTestCases])
  const next = () => {
    setCurrent(current + 1)
  }

  const previous = () => {
    setCurrent(current - 1)
  }

  const handleFormSave = (formData) => {
    setTestRunDetails(formData)
    next()
  }

  const handleClose = () => {
    setCurrent(0)
    setTestRunDetails({})
    setSelectedTestCases([])
    onCancel()
  }

  const handleTestRunCreation = (selectedData) => {
    setLoading(true)
    const testRunPayload = {
      projectId,
      ...testRunDetails,
      testRuns: selectedData.map((tc) => {
        return {
          testCaseId: tc.testCaseId,
          testSuiteId: tc.testSuiteId,
        }
      }),
    }
    if (modalType === 'create') {
      createTestRun(testRunPayload)
        .then(() => {
          setLoading(false)
          Notification('success', 'You have successfully added a new test run.')
          handleClose()
        })
        .catch((error) => {
          setLoading(false)
          Notification('error', `${error.message}`, 'Unable to add the test run')
        })
    } else {
      testRunPayload.id = savedTestRunDetails.id
      updateTestRun(testRunPayload)
        .then(() => {
          setLoading(false)
          Notification('success', 'You have successfully updated test run.')
          handleClose()
        })
        .catch((error) => {
          setLoading(false)
          Notification(
            'error',
            'Could not update the test run. Please try again later!'
          )
        })
    }
  }

  const steps = [
    {
      title: `${
        modalType === 'create'
          ? 'Give Your Test Run A Title & Description'
          : 'Edit Test Run'
      }`,
      content: (
        <StepOneContent details={testRunDetails} onFormSave={handleFormSave} />
      ),
    },
    {
      title: 'Choose Your Test Cases',
      content: (
        <StepTwoContent
          loading={loading}
          onDone={handleTestRunCreation}
          onBack={previous}
          testCases={[...testCases]}
          selectedTestCases={selectedTestCases}
          setSelectedTestCases={setSelectedTestCases}
          workspace={workspace}
          sections={sections}
        />
      ),
    },
  ]

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      visible={visible}
      centered={current === 1}
      width={1300}
      title={modalType === 'create' ? 'Create Test Run' : 'Edit Test Run'}
      okText="Save"
      footer={null}
      cancelText="Cancel"
      onCancel={handleClose}
    >
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </Modal>
  )
}

export default NewTestRunModal
