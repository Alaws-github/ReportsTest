import { emailApiRequest } from '../../util'

//Hook for interacting with the Email API
export function useEmailMutation() {
  // Create a re-invite email
  const sendReinviteEmail = (data) => {
    return emailApiRequest('request-reinvite-mail', 'POST', data)
  }

  return {
    sendReinviteEmail,
  }
}
