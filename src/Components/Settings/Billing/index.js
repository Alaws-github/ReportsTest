import { useState } from 'react'
import {
  Descriptions,
  Button,
  Col,
  Row,
  Typography,
  List,
  Card,
  Divider,
} from 'antd'
import { planPrettyName, plans } from '../../..//constants'
import { useBillingMutation } from '../../..//Util/API/Billing/index'

const { Text } = Typography

const Billing = ({ workspace }) => {
  const { createCustomerPortalLink } = useBillingMutation()
  const [isLoading, setIsLoading] = useState(false)
  const planFeatures = {
    whitelist: plans['qw:enterprise'].features,
    basic: plans['qw:basic:3'].features,
    startup: plans['qw:startup:10'].features,
    professional: plans['qw:professional:20'].features,
    enterprise: plans['qw:enterprise'].features,
  }
  return (
    <Col>
      <Descriptions bordered layout="vertical">
        <Descriptions.Item label="Plan">
          {planPrettyName[workspace?.license]}
        </Descriptions.Item>
        <Descriptions.Item label="What's Included">
          {planFeatures[workspace?.license]?.split(',')?.map((feature) => (
            <>
              - {feature}
              <br />
            </>
          ))}
        </Descriptions.Item>
      </Descriptions>

      <Row
        style={{
          marginTop: '1rem',
        }}
        justify="space-between"
      >
        <Text type="secondary">Manage your subscription on Stripe.</Text>
        <Button
          type="primary"
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true)
            try {
              const { url } = await createCustomerPortalLink()
              window.open(url, '_self')
              isLoading && setIsLoading(false)
            } catch (error) {
              setIsLoading(false)
              console.log('Unable to get portal link', error)
            }
          }}
        >
          Manage Subscription
        </Button>
      </Row>
    </Col>
  )
}

export default Billing
