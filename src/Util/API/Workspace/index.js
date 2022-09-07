import { useQuery, useQueryClient } from 'react-query'
import { workspaceApiRequest } from '../../util'

// Hook for getting projects by userId
export const useGetWorkspace = (user) => {
  // Unique cache key for this query
  const cacheKey = ['workspace']
  // Query for fetching projects
  const query = () => workspaceApiRequest(`get-workspace-by-id`)
  // Fetch with react-query (only if we have a uid)
  // Docs: https://react-query.tanstack.com/docs/guides/queries
  return useQuery(cacheKey, query, {
    enabled: !!user,
  })
}

//Hook for interacting with the Project API
export function useWorkspaceMutation() {
  const queryClient = useQueryClient()

  const updateWorkspace = (data) => {
    return workspaceApiRequest(`update-workspace`, 'POST', data).then(
      (response) => {
        // Invalidate existing query for projects by owner so that it will
        // be refetched next time and include new item.
        queryClient.invalidateQueries('workspace')
        return response
      }
    )
  }

  const inviteUserToWorkspace = (data) => {
    return workspaceApiRequest(`invite-user`, 'POST', data).then((response) => {
      queryClient.invalidateQueries('workspace')
      return response
    })
  }

  const reinviteUserToWorkspace = (data) => {
    return workspaceApiRequest(`reinvite-user`, 'POST', data).then(
      (response) => {
        queryClient.invalidateQueries('workspace')
        return response
      }
    )
  }

  return {
    updateWorkspace,
    inviteUserToWorkspace,
    reinviteUserToWorkspace,
  }
}
