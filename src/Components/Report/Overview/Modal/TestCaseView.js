import { Modal, Space, Typography } from 'antd'
import TestCasePreview from '../../../Common/TestCasePreview'
import StatusTag from '../../../Common/StatusTag'
import TestCaseNavigator from './TestCaseNavigator'
const { Title } = Typography
const TestCaseView = ({
  failedTestCases,
  testCase,
  isVisible,
  setVisible,
  navigateTestCase,
  workspace,
}) => {
  return (
    <Modal
      title={<span>High Priority Failed Test Case Preview</span>}
      width={800}
      destroyOnClose={true}
      maskClosable={false}
      visible={isVisible}
      footer={null}
      onCancel={() => setVisible(false)}
      className="hpftc-view-modal"
    >
      <TestCasePreview
        style={{
          border: 0,
          borderLeft: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        workspace={workspace}
        testCaseTile={() => {
          return (
            <Space size={0} direction="vertical">
              <StatusTag status={testCase.status} />
              <Title level={5} style={{ marginTop: 3 }}>
                {`[TC${testCase.customId}] - ${testCase.title}`}
              </Title>
            </Space>
          )
        }}
        showComments
        showDefect
        innerStyle={{
          height: '70vh',
          overflow: 'auto',
        }}
        testCase={testCase}
      />
      <TestCaseNavigator
        currentIndex={failedTestCases?.findIndex(
          (ct) => ct?.testCaseId === testCase?.testCaseId
        )}
        nextTestCase={() => navigateTestCase('next')}
        previousTestCase={() => navigateTestCase('previous')}
        totalTestCases={failedTestCases?.length}
      />
    </Modal>
  )
}

export default TestCaseView
