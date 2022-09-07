import { useQuery } from 'react-query'
import { keyServiceRequest, sortByDate } from '../../util'

export const createAPIKey = (data) => {
  return keyServiceRequest('generate-api-key', 'POST', data)
}

export const useGetAPIKeysByUser = () => {
  // Unique cache key for this query
  const cacheKey = ['apiKeys']
  // Query for fetching projects
  const query = () =>
    keyServiceRequest(`list-key-by-userId`).then((res) => {
      return sortByDate(res, 'created_at')
    })
  // Fetch with react-query (only if we have a uid)
  // Docs: https://react-query.tanstack.com/docs/guides/queries
  return useQuery(cacheKey, query)
}
