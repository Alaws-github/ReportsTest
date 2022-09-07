import { Typography, Row, Space, Card } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import {
  PaymentCheckIcon,
  PlanIconBackground,
  EnterprisePlanIcon,
  ProfessionalPlanIcon,
  BasicPlanIcon,
  StartupPlanIcon,
} from '../../Common/CustomIcons/index'
import { useMedia } from '../../../Hooks'

const { Title, Text } = Typography

const listOfMedias = [
  '(min-width: 640px)',
  '(max-width: 768px)',
  '(min-width: 1080px)',
]

const PlanIcon = ({ plan, ...rest }) => {
  const iconMap = {
    enterprise: EnterprisePlanIcon,
    professional: ProfessionalPlanIcon,
    basic: BasicPlanIcon,
    startup: StartupPlanIcon,
  }
  let planName = plan?.split?.(' ')?.[0]
  const PlanIconComponent = iconMap[planName]
  return planName ? (
    <PlanIconComponent {...rest} />
  ) : (
    <PlanIconBackground {...rest} />
  )
}

const Description = ({ children }) => {
  const lineHeight = useMedia(null, ['20px', '16px'], '16px')
  return (
    <Text
      style={{
        color: '#fff',
        lineHeight,
        fontWeight: 'bold',
        textAlign: 'center',
      }}
      type="secondary"
    >
      {children}
    </Text>
  )
}

const Plan = ({ title, features }) => {
  const planIconFontSize = useMedia(
    listOfMedias,
    ['1rem', '1.2rem', '1.2rem'],
    '1.2rem'
  )
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Row
        style={{
          marginBottom: '2rem',
        }}
        justify="center"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '10',
          }}
        >
          <PaymentCheckIcon style={{ fontSize: '3rem' }} />
          <Title
            style={{
              color: '#fff',
              marginBottom: '.5rem',
              marginTop: '.5rem',
            }}
            level={3}
          >
            Create an account to continue.
          </Title>
          <Description>
            Seems like you would like to get started with the {title}.
          </Description>
          <Description>
            Once your workspace is created, you can continue the checkout
            process.
          </Description>
        </div>
      </Row>
      <Row justify="center">
        <Card
          style={{
            borderRadius: '25px',
          }}
          className="shadow-lg"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PlanIcon
              plan={title?.toLowerCase()}
              style={{
                fontSize: '2rem',
                marginTop: '-.5rem',
              }}
              className="plan-icon"
            />
            <Title
              style={{
                color: '#398DE4',
                marginBottom: '.5rem',
                marginTop: '.5rem',
              }}
              level={3}
            >
              {title}
            </Title>
            <Row justify="center">
              <Space direction="vertical">
                {features.map((feature, index) => {
                  return (
                    <Text
                      italic
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      key={index}
                    >
                      <CheckCircleFilled
                        style={{
                          marginRight: '8px',
                          fontSize: planIconFontSize,
                          color: '#398DE4',
                        }}
                      />
                      {feature.trim()}
                    </Text>
                  )
                })}
              </Space>
            </Row>
          </div>
        </Card>
      </Row>
    </div>
  )
}

export default Plan
