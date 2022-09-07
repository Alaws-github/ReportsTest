import React from 'react'
import { PlusCircleFilled } from '@ant-design/icons'
import { Button, Row, Typography, Space } from 'antd'
import ViewerTooltip from '../Common/ViewerTooltip'
import { useUser } from '../../Context/UserContext'

const { Title, Text } = Typography

const PrimaryPageHeader = ({
  loading,
  title,
  description,
  onClick,
  leftButtonLabel,
  secondaryOnClick,
  secondaryButtonLabel,
  showForViewer,
  disableForEditor,
}) => {
  const { isViewer, isEditor } = useUser()

  return (
    <>
      <Row justify="space-between" align="middle">
        <Space
          style={{
            marginBottom: 25,
          }}
          size={-10}
          direction="vertical"
        >
          <Title
            style={{
              fontSize: '28px',
            }}
          >
            {title}
          </Title>
          {description ? (
            <Text
              style={{
                fontSize: '15px',
              }}
            >
              {description}
            </Text>
          ) : (
            <></>
          )}
        </Space>
        <div>
          {secondaryOnClick && (
            <ViewerTooltip
              isViewer={
                (isViewer && !showForViewer) || (disableForEditor && isEditor)
              }
            >
              <Button
                loading={loading}
                size="large"
                type="secondary"
                icon={<PlusCircleFilled />}
                disabled={
                  (isViewer && !showForViewer) || (disableForEditor && isEditor)
                }
                onClick={secondaryOnClick}
                style={{
                  marginRight: 5,
                }}
              >
                {secondaryButtonLabel}
              </Button>
            </ViewerTooltip>
          )}
          {onClick && (
            <ViewerTooltip
              isViewer={
                (isViewer && !showForViewer) || (disableForEditor && isEditor)
              }
            >
              <Button
                loading={loading}
                size="large"
                type="primary"
                icon={<PlusCircleFilled />}
                disabled={
                  (isViewer && !showForViewer) || (disableForEditor && isEditor)
                }
                onClick={onClick}
              >
                {leftButtonLabel}
              </Button>
            </ViewerTooltip>
          )}
        </div>
      </Row>
      {/* <Divider style={{ backgroundColor: '#D5D8DC' }} /> */}
    </>
  )
}
export default PrimaryPageHeader
