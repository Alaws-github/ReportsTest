import React, { useState, useEffect } from 'react'
import { Modal, Button, Space, Divider, Input, Typography, Tooltip } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { FiLink } from 'react-icons/fi'
const { Text } = Typography
const ShareOption = ({
  isLoading,
  reportId,
  isVisible,
  setVisible,
  reportLinkId,
  handleGenerateShareableReport,
}) => {
  const inputRef = React.useRef(null)
  const [copied, setCopied] = useState(false)
  const [link, setLink] = useState(
    `${window.location.origin}/shareable-report/r${reportLinkId}`
  )
  const handleCopy = () => {
    inputRef.current.focus({
      cursor: 'all',
    })
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }
  useEffect(() => {
    if (reportLinkId) {
      setLink(`${window.location.origin}/shareable-report/r${reportLinkId}`)
    }
  }, [reportLinkId, isLoading])

  return (
    <Modal
      title={'Share Report'}
      visible={isVisible}
      onCancel={() => setVisible(false)}
      footer={null}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Space
        direction="vertical"
        style={{
          width: '100%',
        }}
      >
        <Button
          size="large"
          style={{
            width: '100%',
          }}
          disabled={true}
          type="primary"
        >
          Download as PDF
        </Button>
        <Divider />
        {!reportLinkId ? (
          <Button
            size="large"
            style={{
              width: '100%',
            }}
            type="primary"
            onClick={handleGenerateShareableReport}
            loading={isLoading}
          >
            Generate Shareable Link
          </Button>
        ) : (
          <>
            <Text
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Share via link
            </Text>
            <Input.Group compact>
              <Input
                ref={inputRef}
                size="large"
                value={link}
                style={{ width: '90%' }}
              />
              <Tooltip title={copied ? 'Copied' : 'Copy'}>
                <Button
                  onClick={handleCopy}
                  style={{ width: '10%' }}
                  size="large"
                  icon={
                    <>
                      {!copied ? (
                        <FiLink
                          style={{
                            marginTop: '0.3rem',
                          }}
                        />
                      ) : (
                        <CheckOutlined
                          style={{
                            marginTop: '0.3rem',
                          }}
                        />
                      )}{' '}
                    </>
                  }
                  type="primary"
                />
              </Tooltip>
            </Input.Group>
          </>
        )}
      </Space>
    </Modal>
  )
}

export default ShareOption
