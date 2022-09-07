import Icon from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faArrowCircleDown,
} from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as WhiteCircleSVG } from '../../../assets/registration/white-circle.svg'
import { ReactComponent as NewHereQuestionSVG } from '../../../assets/registration/new-here-question.svg'
import { ReactComponent as PaymentCheckSVG } from '../../../assets//registration/check-payment.svg'
import { ReactComponent as PlanIconBackgroundSVG } from '../../../assets/registration/icon-background.svg'
import { ReactComponent as EnterprisePlanIconSVG } from '../../../assets/registration/enterprise-plan.svg'
import { ReactComponent as ProfessionalPlanIconSVG } from '../../../assets/registration/professional-plan.svg'
import { ReactComponent as StartupPlanIconSVG } from '../../../assets/registration/startup-plan.svg'
import { ReactComponent as BasicPlanIconSVG } from '../../../assets/registration/basic-plan.svg'

export const WhiteCircleIcon = (props) => (
  <Icon component={WhiteCircleSVG} {...props} />
)

export const RightArrow = (props) => (
  <FontAwesomeIcon icon={faArrowRight} {...props} />
)

export const DownArrowIcon = (props) => (
  <FontAwesomeIcon icon={faArrowCircleDown} {...props} />
)

export const NewHereQuestionIcon = (props) => (
  <Icon component={NewHereQuestionSVG} {...props} />
)

export const PaymentCheckIcon = (props) => (
  <Icon component={PaymentCheckSVG} {...props} />
)

export const PlanIconBackground = (props) => (
  <Icon component={PlanIconBackgroundSVG} {...props} />
)

export const EnterprisePlanIcon = (props) => (
  <Icon component={EnterprisePlanIconSVG} {...props} />
)

export const ProfessionalPlanIcon = (props) => (
  <Icon component={ProfessionalPlanIconSVG} {...props} />
)

export const StartupPlanIcon = (props) => (
  <Icon component={StartupPlanIconSVG} {...props} />
)

export const BasicPlanIcon = (props) => (
  <Icon component={BasicPlanIconSVG} {...props} />
)
