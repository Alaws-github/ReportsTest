import { useQuery, useQueryClient } from 'react-query'
import { jiraIntegrationRequest } from '../../util'

//Hook for interacting with the JIRA integration API
export function useJiraMutation() {
  const queryClient = useQueryClient()
  const integrateWithJira = (data) => {
    return jiraIntegrationRequest('integrate', 'POST', data)
  }

  const authenticateUserWithJira = (data) =>
    jiraIntegrationRequest('authenticate-user', 'POST', data)

  const createIssue = (data, testRunId) => {
    return jiraIntegrationRequest('create-defect', 'POST', data).then(
      (response) => {
        // Invalidate existing query for projects by owner so that it will
        // be refetched next time and include new item.
        queryClient.invalidateQueries('test-runner-data')
        return response
      }
    )
  }

  const disconnectJiraFromWorkspace = () =>
    jiraIntegrationRequest(`disconnect`).then((response) => {
      queryClient.invalidateQueries('workspace')
      return response
    })

  const disconnectJiraFromUser = () =>
    jiraIntegrationRequest(`disconnect-user`).then((response) => {
      queryClient.invalidateQueries('user')
      return response
    })

  return {
    integrateWithJira,
    authenticateUserWithJira,
    createIssue,
    disconnectJiraFromWorkspace,
    disconnectJiraFromUser,
  }
}

// Hook for getting JIRA projects
export const useGetJiraProjects = ({ startAt = 0, isVisible }) => {
  // Unique cache key for this query
  const cacheKey = ['jiraProjects', { startAt }]
  // Query for fetching projects
  const query = () => jiraIntegrationRequest(`list-projects?startAt=${startAt}`)
  // Fetch with react-query (only if we have a uid)
  // Docs: https://react-query.tanstack.com/docs/guides/queries
  return useQuery(cacheKey, query, { enabled: isVisible })
}

export const useGetJiraIssue = ({ issueId, isVisible }) => {
  // Unique cache key for this query
  const cacheKey = ['jiraIssue', { issueId }]
  // Query for fetching projects
  const query = () => jiraIntegrationRequest(`get-issue?issueKey=${issueId}`)
  // Fetch with react-query (only if we have a uid)
  // Docs: https://react-query.tanstack.com/docs/guides/queries
  return useQuery(cacheKey, query, { enabled: isVisible })
}
