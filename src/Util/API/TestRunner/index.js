import { useQuery, useQueryClient } from 'react-query'
import { testRunnerApiRequest } from '../../util'

export const GetTestRunData = ({ projectId, customExecutionId }) => {
  const cacheKey = ['test-runner-data', { customExecutionId }]
  const query = () =>
    testRunnerApiRequest(`get-test-run-data?customExecutionId=${customExecutionId}&projectId=${projectId}`)
  return useQuery(cacheKey, query, { enabled: !!customExecutionId && !!projectId })
}

export const GetTestRunSummary = (id) => {
  const cacheKey = ['test-runner-summary', { id }]
  const query = () =>
    testRunnerApiRequest(`get-test-run-summary?executionId=${id}`)
  return useQuery(cacheKey, query)
}

export const useGetTestRunQuality = (testRunId) => {
  const cacheKey = ['test-run-quality', { testRunId }]
  const query = () =>
    testRunnerApiRequest(`get-run-quality?testExecutionCycleId=${testRunId}`)
  return useQuery(cacheKey, query, { enabled: !!testRunId })
}

//Hook for interacting with the Test Runner API
export function useTestRunnerMutation() {
  const queryClient = useQueryClient()

  //Update test run status
  const updateTestRunStatus = (data) => {
    return testRunnerApiRequest('update-test-run-status', 'POST', data).then(
      (response) => {
        // Invalidate existing query for projects by owner so that it will
        // be refetched next time and include new item.
        queryClient.invalidateQueries('test-runner-data')
        return response
      }
    )
  }

  const addComment = (data) => {
    return testRunnerApiRequest('add-comment', 'POST', data).then(
      (response) => {
        // Invalidate existing query for projects by owner so that it will
        // be refetched next time and include new item.
        queryClient.invalidateQueries('test-runner-data')
        return response
      }
    )
  }

  const updateComment = (data) => {
    return testRunnerApiRequest('update-comment', 'POST', data).then(
      (response) => {
        // Invalidate existing query for projects by owner so that it will
        // be refetched next time and include new item.
        queryClient.invalidateQueries('test-runner-data')
        return response
      }
    )
  }

  return {
    updateTestRunStatus,
    addComment,
    updateComment,
  }
}
