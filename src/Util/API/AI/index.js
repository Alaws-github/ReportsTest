import { aiServiceRequest } from '../../util'

//Hook for interacting with the AI Service API
export function useAIServiceMutation() {
  // Generate Test Cases from requirements
  const generateTestCase = (userStory) => {
    return aiServiceRequest('generate-test-case', 'POST', { userStory }).then(
      (response) => {
        if (response && response?.length !== 0) {
          return response
            .filter((tc) => {
              if (!tc?.title || tc?.title === '') return false
              return true
            })
            .map((tc) => {
              return {
                ...tc,
                added: false,
              }
            })
        } else {
          return []
        }
      }
    )
  }
  return {
    generateTestCase,
  }
}
