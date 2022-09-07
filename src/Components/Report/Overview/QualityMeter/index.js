import React, { useState } from 'react'
import { Row, Typography, Col } from 'antd'
import { Gauge } from '@ant-design/charts'
import TestCaseView from '../Modal/TestCaseView'
import HighPriorityFailedTestCaseList from './/HighPriorityFailedTestCaseList'
import FailedTestCaseNavigation from './FailedTestCaseNavigation'
import RCard from '../../RCard'
const { Text } = Typography
const QualityMeter = ({
  highPriorityFailedTestCases: failedTestCases,
  qualityScore,
  workspace,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTestCase, setCurrentTestCase] = useState(null)
  const [showTestCase, setShowTestCase] = useState(false)
  const ticks = [0, 1 / 3, 2 / 3, 1]
  const color = ['#F4664A', '#FAAD14', '#30BF78']
  const config = {
    autoFit: true,
    percent: qualityScore,
    range: {
      ticks: [0, 1],
      color: ['l(0) 0:#F4664A 0.5:#FAAD14 1:#30BF78'],
    },
    axis: {
      label: {
        formatter: function formatter(v) {
          return Number(v) * 100
        },
      },
      subTickLine: { count: 3 },
    },
    indicator: {
      pointer: { style: { stroke: '#D0D0D0' } },
      pin: { style: { stroke: '#D0D0D0' } },
    },
    statistic: {
      title: {
        formatter: function formatter(_ref) {
          var percent = _ref.percent
          if (percent < ticks[1]) {
            return (percent * 100).toFixed(0) + '%'
          }
          if (percent < ticks[2]) {
            return (percent * 100).toFixed(0) + '%'
          }
          return (percent * 100).toFixed(0) + '%'
        },
        style: function style(_ref2) {
          var percent = _ref2.percent
          return {
            fontSize: '30px',
            lineHeight: 1,
            color:
              percent < ticks[1]
                ? color[0]
                : percent < ticks[2]
                ? color[1]
                : color[2],
          }
        },
      },
      content: {
        offsetY: 36,
        style: {
          fontSize: '24px',
          color: '#4B535E',
        },
        formatter: function formatter() {
          return ''
        },
      },
    },
  }

  const navigate = (direction) => {
    const numberOfPages = Math.ceil(failedTestCases.length / 4)

    if (direction === 'next' && currentPage < numberOfPages) {
      setCurrentPage(currentPage + 1)
    } else {
      setCurrentPage(1)
    }

    if (direction === 'previous' && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    } else if (direction === 'previous') {
      setCurrentPage(numberOfPages)
    }
  }

  const navigateTestCase = (direction) => {
    const numberOfTestCases = failedTestCases.length
    const currentTestCaseIndex = failedTestCases.findIndex(
      (ct) => ct?.testCaseId === currentTestCase?.testCaseId
    )

    if (direction === 'next' && currentTestCaseIndex < numberOfTestCases - 1) {
      setCurrentTestCase(failedTestCases[currentTestCaseIndex + 1])
    } else {
      setCurrentTestCase(failedTestCases[0])
    }

    if (direction === 'previous' && currentTestCaseIndex !== 0) {
      setCurrentTestCase(failedTestCases[currentTestCaseIndex - 1])
    } else if (direction === 'previous') {
      setCurrentTestCase(failedTestCases[numberOfTestCases - 1])
    }
  }

  return (
    <>
      <RCard title="QualityMeter">
        <Row
          justify="center"
          style={{
            textAlign: 'center',
          }}
        >
          <Gauge
            {...config}
            style={{
              marginTop: 0,
              height: 'calc(50vh - 18.5em)',
            }}
          />
          {failedTestCases?.length !== 0 ? (
            <Text
              type="danger"
              style={{
                padding: '0.5em',
                fontSize: '1.2em',
                fontWeight: 'bold',
              }}
            >
              Oh no! Some high priority test cases have failed.
            </Text>
          ) : (
            <Text
              style={{
                padding: '0.5em',
                fontSize: '1.2em',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              No failed high priority test cases.
            </Text>
          )}
        </Row>
        <Row justify="center">
          <div
            style={{
              margin: 0,
              padding: 5,
              width: '100%',
              backgroundColor: '#001528',
              color: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              High priority failed test cases{' '}
            </div>
            <div
              style={{
                backgroundColor: '#fff',
                color: 'red',
                marginLeft: '0.5rem',
                borderRadius: '50%',
                width: '30px',
                lineHeight: '30px',
                textAlign: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}
            >
              {failedTestCases?.length || 0}
            </div>
          </div>
          <Col span={24}>
            <HighPriorityFailedTestCaseList
              failedTestCases={failedTestCases}
              currentPage={currentPage}
              setShowTestCase={setShowTestCase}
              setCurrentTestCase={setCurrentTestCase}
            />
          </Col>
        </Row>
        <Row
          justify="end"
          style={{
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          {failedTestCases && failedTestCases?.length !== 0 && (
            <FailedTestCaseNavigation
              navigate={navigate}
              currentPage={currentPage}
              failedTestCases={failedTestCases}
            />
          )}
        </Row>
      </RCard>
      <TestCaseView
        isVisible={showTestCase}
        setVisible={setShowTestCase}
        testCase={currentTestCase}
        workspace={workspace}
        failedTestCases={failedTestCases}
        navigateTestCase={navigateTestCase}
      />
    </>
  )
}
export default QualityMeter
