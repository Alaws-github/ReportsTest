import { useQuery, useQueryClient } from 'react-query'
import { userApiRequest } from '../../util'
import { useAuth } from '../../../Context/AuthContext'
import { Notification } from '../../../Components/Common/Feedback'

//Hook for interacting with the Project API
export function useUserMutation() {
  const queryClient = useQueryClient()

  const updateUser = (data) => {
    return userApiRequest(`update-user`, 'POST', data).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('workspace')
      return response
    })
  }

  const setUserInvitationStatus = (data) => {
    return userApiRequest(`set-accepted-user-status`, 'POST', data, true)
  }

  const disableUser = (data) => {
    return userApiRequest(`disable-user`, 'POST', data).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('workspace')
      return response
    })
  }

  const enableUser = (data) => {
    return userApiRequest(`enable-user`, 'POST', data).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('workspace')
      return response
    })
  }

  const changeUserRole = (data) => {
    return userApiRequest(`change-user-role`, 'POST', data).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('workspace')
      return response
    })
  }

  return {
    updateUser,
    setUserInvitationStatus,
    disableUser,
    enableUser,
    changeUserRole,
  }
}

// Hook for getting projects by userId
export const useGetUser = () => {
  const { updateUser } = useUserMutation()
  const { signOut } = useAuth()
  // Unique cache key for this query
  const cacheKey = ['user']
  // Query for fetching projects
  const query = () =>
    userApiRequest(`get-user-by-id`).then((response) => {
      if (response?.access_updated && response?.access_updated === true) {
        // update status to false and then log out user
        updateUser({ ...response, access_updated: false })
          .then(() => {
            // log out user
            Notification(
              'warning',
              'You will be logged out shortly, please log in to continue working.',
              'Your permissions were updated!'
            )
            setTimeout(async () => {
              await signOut()
            }, 5000)
          })
          .catch(() => {
            // don't log out user
            console.log('Could not update user to log them out')
            return response
          })
      }
      return response
    })
  // Fetch with react-query (only if we have a uid)
  // Docs: https://react-query.tanstack.com/docs/guides/queries
  return useQuery(cacheKey, query)
}

export const useGetWorkspaceUserList = (workspaceId) => {
  // Unique cache key for this query
  const cacheKey = ['users']
  // Query for fetching projects
  const query = () =>
    userApiRequest(`list-workspace-users?workspaceId=${workspaceId}`).then(
      (response) => {
        const users = response.map((user) => {
          return {
            ...user,
            status: user.status.toLowerCase(),
          }
        })
        return users.sort((a, b) => a.email.localeCompare(b.email))
      }
    )
  // Fetch with react-query (only if we have a uid)
  // Docs: https://react-query.tanstack.com/docs/guides/queries
  return useQuery(cacheKey, query, { enabled: !!workspaceId })
}
