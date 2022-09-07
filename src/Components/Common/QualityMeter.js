import { Card, Row, Modal, Space } from 'antd'
import { InfoCircleTwoTone } from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import EllipsisTooltip from './EllipsisTooltip'
import { Gauge } from '@ant-design/charts'
import { analyticsActions } from '../../Util/util'
import { Link } from 'react-router-dom'

function QualityMeter({ percentAmount, testRunTitle }) {
  var [percent, setPercent] = useState(0)

  var ticks = [0, 1 / 3, 2 / 3, 1]
  var color = ['#F4664A', '#FAAD14', '#30BF78']
  var config = {
    autoFit: true,
    percent,
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

  const handleLearnMoreClick = () => {
    analyticsActions.qualityMeterInterest('Learn More Clicked')
    Modal.confirm({
      title: 'COMING SOON!!',
      content: (
        <Space direction="vertical">
          <div>
            Our QualityMeter gives a measurement of quality for the application
            under testing.
          </div>
          <div>
            With this tool, your entire development and leadership teams will
            have a better understanding of what to expect regarding the quality
            of each build/release.
          </div>
          <div>
            Would you be interested in having this kind of information to share
            with your team?
          </div>
        </Space>
      ),
      icon: <InfoCircleTwoTone />,
      onOk: () => {
        analyticsActions.qualityMeterInterest('Interested')
      },
      onCancel: () => {
        analyticsActions.qualityMeterInterest('Not Interested')
      },
      okText: 'Interested',
      cancelText: 'Not Interested',
      centered: true,
    })
  }

  useEffect(() => {
    setPercent(percentAmount || 0)
  })

  return (
    <Card
      title={
        <Row className="custom-header">
          <div
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {testRunTitle ? (
              <EllipsisTooltip title={`QualityMeter (${testRunTitle})`}>
                <>{`QualityMeter (${testRunTitle})`}</>
              </EllipsisTooltip>
            ) : (
              <EllipsisTooltip title="QualityMeter">
                QualityMeter
              </EllipsisTooltip>
            )}
          </div>
        </Row>
      }
    >
      <Row
        style={{
          height: 'calc(100vh - 43.8em)',
        }}
        justify="center"
        align="middle"
      >
        <Gauge {...config} />
      </Row>
      <Row justify="center">
        <Link
          style={{ fontSize: 16 }}
          onClick={handleLearnMoreClick}
          type="link"
        >
          Learn More
        </Link>
      </Row>
    </Card>
  )
}

export default QualityMeter
