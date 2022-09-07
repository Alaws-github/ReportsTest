import { billingServiceRequest } from '../../util'

export const useBillingMutation = () => {
  const createCustomerPortalLink = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.hash = ''
    currentUrl.search = ''
    return billingServiceRequest(
      `create-portal-session?returnURL=${currentUrl.toString()}?settings=subscription`
    )
  }

  const createCheckoutSession = () => {
    return billingServiceRequest(`create-checkout-session`)
  }

  return {
    createCustomerPortalLink,
    createCheckoutSession,
  }
}
