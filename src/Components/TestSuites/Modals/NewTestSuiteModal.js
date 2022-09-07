import React, { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { Modal, Steps } from 'antd'
import { Notification } from '../../Common/Feedback'
import StepOneContent from './StepOneContent'
import StepTwoContent from './StepTwoContent'
import StepThreeContent from './StepThreeContent'
import {
  useGetTestSuiteTemplateBySuiteId,
  useTestSuitesMutation,
} from '../../../Util/API/TestSuites'
import { analyticsActions } from '../../../Util/util'
import { useAuth } from '../../../Context/AuthContext'
import CustomSuite from './CustomSuite'
const NewTestSuiteModal = ({ visible, templates, onCancel, projectId }) => {
  const [selectedSuite, setSelectedSuite] = useState()
  const [selectedTestCases, setSelectedTestCases] = useState([])
  const [testCaseDetails, setTestCaseDetails] = useState(null)
  const [customSuiteSelected, setCustomSuiteSelected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = React.useState(0)
  const { Step } = Steps
  const { currentUser } = useAuth()

  const { data: testCases } = useGetTestSuiteTemplateBySuiteId(
    selectedSuite && selectedSuite.id
  )
  const { createTestSuite } = useTestSuitesMutation()

  const onSelect = (data) => {
    if (selectedSuite) {
      if (data.id !== selectedSuite.id) {
        setSelectedTestCases([])
      }
    }
    setSelectedSuite(data)
  }
  const next = () => {
    setCurrent(current + 1)
  }
  const prev = () => {
    setCurrent(current - 1)
  }

  const handleSaveSelectedCase = (data) => {
    setSelectedTestCases(data)
  }

  const closeEverything = () => {
    onCancel()
    setCurrent(0)
    setSelectedSuite(null)
    setSelectedTestCases([])
    setCustomSuiteSelected(false)
  }

  const steps = [
    {
      title: 'Start Building Your Test Suite',
      content: (
        <StepOneContent
          onNext={next}
          templates={templates}
          onSelect={onSelect}
          selectedSuite={selectedSuite && selectedSuite.id}
          onCustomSuiteSelected={() => {
            setCustomSuiteSelected(true)
          }}
        />
      ),
    },
    {
      title: 'Choose Your Test Case Templates',
      content: (
        <StepTwoContent
          onBack={(data) => {
            handleSaveSelectedCase(data)
            prev()
          }}
          onNext={(data) => {
            handleSaveSelectedCase(data)
            next()
          }}
          testCases={testCases || []}
          title={
            selectedSuite && selectedSuite.title ? selectedSuite.title : ''
          }
          savedTestCases={selectedTestCases}
        // setSelectedTestCases={setSelectedTestCases}
        />
      ),
    },
    {
      title: 'Give Your Test Suite a Name',
      content: (
        <StepThreeContent
          details={testCaseDetails}
          setTestCaseDetails={setTestCaseDetails}
          loading={loading}
          onBack={() => {
            prev()
          }}
          onFormSave={(formDetails) => {
            setLoading(true)
            let data = {
              projectId: projectId,
              author: currentUser.attributes.sub,
              title: formDetails.title,
              description: formDetails.description,
              testCases: selectedTestCases.map((item) => {
                return {
                  ...item,
                  author: currentUser.attributes.sub,
                  referenceUrl: '',
                  referenceKey: '',
                  section: null, // TODO: add section or figure how to update sections after suite creation
                }
              }),
            }
            createTestSuite(data)
              .then(() => {
                Notification(
                  'success',
                  `You have successfully added a new test suite.`
                )
                setLoading(false)
                analyticsActions.templateSuiteCreated(
                  data.testCases[0].suiteId,
                  data.testCases.map((tc) => tc.id)
                )
                closeEverything()
              })
              .finally(() => {
                setLoading(false)
              })
              .catch((error) => {
                setLoading(false)
                Notification(
                  'error',
                  `Unable to add test suite. Please try again later.`
                )
              })
          }}
        />
      ),
    },
  ]
  const TemplateFlow = () => {
    return (
      <>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div className="steps-content">{steps[current].content}</div>
      </>
    )
  }
  const CustomFlow = () => (
    <>
      <CustomSuite
        saveForm={(suiteData) => {
          let data = {
            projectId: projectId,
            author: currentUser.attributes.sub,
            title: suiteData.title,
            description: suiteData.description,
          }
          createTestSuite(data)
            .then((response) => {
              setLoading(false)
              analyticsActions.customSuiteCreated()
              closeEverything()
              setCustomSuiteSelected(false)
              Notification(
                'success',
                `${response.title} was created successfully!`
              )
            })
            .finally(() => {
              setLoading(false)
            })
            .catch((error) => {
              console.log(error)
            })
        }}
        loading={loading}
        onClick={() => {
          setCustomSuiteSelected(false)
        }}
        closeModal={() => {
          closeEverything()
        }}
      />
    </>
  )
  return (
    <Modal
      maskClosable={false}
      centered
      destroyOnClose
      visible={visible}
      width={1300}
      title="New test suite"
      okText="Save"
      footer={null}
      cancelText="Cancel"
      onCancel={() => {
        closeEverything()
      }}
    >
      {!customSuiteSelected ? <TemplateFlow /> : <CustomFlow />}
    </Modal>
  )
}
export default NewTestSuiteModal
