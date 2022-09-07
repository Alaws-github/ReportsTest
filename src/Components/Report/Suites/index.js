import React, { useState } from 'react'
import { Row, Col, Card, Typography, Select, Tag, Space } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import Icon from '@ant-design/icons'
import { FaRegCircle } from 'react-icons/fa'
import { CgPlayTrackNextO } from 'react-icons/cg'
import { statusColors } from '../../../constants'
import SuitesAndResultsList from './SuitesAndResultsList'
import TestCasePreview from '../../Common/TestCasePreview'
import StatusTag from '../../Common/StatusTag'
import ElapsedTime from '../../Common/ElapsedTime'
const { Text, Title } = Typography
const Suites = ({ suites, overview, workspace }) => {
  const [currentSections, setCurrentSections] = useState(null)
  const [currentTestCase, setCurrentTestCase] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState([])
  const highPriorityCount = suites?.reduce((acc, suite) => {
    const suitePriority = suite?.testCases?.filter(
      (testCase) => testCase?.priority === 'P1'
    )?.length
    return acc + suitePriority
  }, 0)
  const statusData = {
    passed: {
      icon: <CheckCircleOutlined />,
      color: statusColors.passed,
    },
    failed: {
      icon: <CloseCircleOutlined />,
      color: statusColors.failed,
    },
    blocked: {
      icon: <ExclamationCircleOutlined />,
      color: statusColors.blocked,
    },
    skipped: {
      icon: <Icon component={CgPlayTrackNextO} />,
      color: statusColors.skipped,
    },
    not_executed: {
      icon: <Icon component={FaRegCircle} />,
      color: statusColors.not_executed,
    },
    high_priority: {
      color: 'cyan',
    },
  }
  const options = [
    { value: 'high_priority', label: `High priority (${highPriorityCount})` },
    { value: 'passed', label: `Passed (${overview?.passed})` },
    { value: 'failed', label: `Failed (${overview?.failed})` },
    { value: 'blocked', label: `Blocked (${overview?.blocked})` },
    { value: 'skipped', label: `Skipped (${overview?.skipped})` },
    { value: 'not_executed', label: `Not Executed (${overview?.notExecuted})` },
  ]

  function handleChange(value) {
    setSelectedStatus(value.includes(',') ? [...value.split(',')] : [...value])
  }

  function tagRender(props) {
    const { label, value, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        color={statusData[value].color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    )
  }
  return (
    <>
      <Row>
        <span
          style={{
            width: '100%',
          }}
        >
          <Text
            style={{
              marginRight: '1rem',
            }}
          >
            Filter by:
          </Text>
          <Select
            onChange={handleChange}
            mode="multiple"
            showArrow
            tagRender={tagRender}
            style={{ width: '90%' }}
            placeholder="Select to filter results"
            options={options}
          />
        </span>
      </Row>
      <Row
        style={{
          marginTop: '1rem',
        }}
      >
        <Col span={12}>
          <Card
            style={{
              height: 'calc(100vh - 19em)',
              position: 'relative',
              overflowY: 'auto',
            }}
            title={
              <>
                <Text
                  style={{
                    marginRight: '1em',
                  }}
                  level={3}
                >
                  Suites
                </Text>
                <Text type="secondary">
                  {suites?.length || 0} suite/s in total in this test run
                </Text>
              </>
            }
            className="shadow-sm no-scroll"
          >
            <div style={{}}>
              <SuitesAndResultsList
                setCurrentTestCase={setCurrentTestCase}
                setCurrentSections={setCurrentSections}
                currentSections={currentSections}
                selectedStatus={selectedStatus}
                currentTestCase={currentTestCase}
                suites={suites}
              />
            </div>
          </Card>
        </Col>
        <Col
          style={{
            padding: '1rem',
          }}
          span={12}
        >
          <TestCasePreview
            sections={currentSections}
            workspace={workspace}
            height="calc(100vh - 22.6em)"
            title={''}
            testCase={currentTestCase}
            shadow={false}
            style={{
              border: 0,
              borderLeft: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            showComments={true}
            testCaseTile={() => {
              return (
                <Space size={0} direction="vertical">
                  <Row align="middle">
                    <StatusTag status={currentTestCase.status} />
                    <ElapsedTime
                      time={currentTestCase.elapsedTime}
                      status={currentTestCase.status}
                    />
                  </Row>
                  <Title level={5} style={{ marginTop: 3 }}>
                    {`${currentTestCase.title}`}
                  </Title>
                </Space>
              )
            }}
          />
        </Col>
      </Row>
    </>
  )
}

export default Suites
