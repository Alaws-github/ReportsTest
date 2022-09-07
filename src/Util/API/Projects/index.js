import { useQuery, useQueryClient } from 'react-query'
import { apiRequest } from '../../util'

//Hook for interacting with the Project API
export function useProjectsMutation() {
  const queryClient = useQueryClient()

  // Create a project
  const createProject = (data) => {
    return apiRequest('create-project', 'POST', data).then((project) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries(['workspace'])
      return project
    })
  }

  // Delete a project
  const deleteProject = (projectId) => {
    return apiRequest(`delete-project?projectId=${projectId}`, 'DELETE').then(
      (response) => {
        // Invalidate existing query for projects by owner so that it will
        // be refetched next time and include new item.
        queryClient.invalidateQueries('workspace')
        queryClient.invalidateQueries('archived-projects')
        return response
      }
    )
  }

  //Update a project
  const updateProject = (data) => {
    return apiRequest(`update-project`, 'POST', data).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('workspace')
      queryClient.invalidateQueries('archived-projects')
      return response
    })
  }

  //Unarchive a project
  const unArchiveProject = (projectId) => {
    return apiRequest(`unarchive-project?projectId=${projectId}`, 'POST').then(
      (response) => {
        // Invalidate existing query for projects by owner so that it will
        // be refetched next time and include new item.
        queryClient.invalidateQueries('workspace')
        queryClient.invalidateQueries('archived-projects')
        return response
      }
    )
  }

  return {
    createProject,
    deleteProject,
    updateProject,
    unArchiveProject,
  }
}

// Hook for getting projects by userId
export const useGetProjectsByUser = () => {
  // Unique cache key for this query
  const cacheKey = ['projects']
  // Query for fetching projects
  const query = () => apiRequest(`list-project-by-user`)
  // Fetch with react-query (only if we have a uid)
  // Docs: https://react-query.tanstack.com/docs/guides/queries
  return useQuery(cacheKey, query)
}

export const useGetArchivedProjects = () => {
  // Unique cache key for this query
  const cacheKey = ['archived-projects']
  // Query for fetching archived projects
  const query = () => apiRequest(`list-archived-projects`)
  // Fetch with react-query (only if we have a uid)
  // Docs: https://react-query.tanstack.com/docs/guides/queries
  return useQuery(cacheKey, query, {
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}
