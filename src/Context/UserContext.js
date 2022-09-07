import React, { useContext, createContext, useState, useEffect } from 'react'
import { useGetUser } from '../Util/API/User'

const userContext = createContext()

export function UserProvider({ children }) {
  const user = useUserProvider()
  return <userContext.Provider value={user}>{children}</userContext.Provider>
}

export const useUser = () => {
  return useContext(userContext)
}

function useUserProvider() {
  const [user, setUser] = useState()
  const { data: userData } = useGetUser()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const uData = {
      ...userData,
      isViewer: user?.role === 'Viewer',
      isAdmin: user?.role === 'Admin',
      isEditor: user?.role === 'Editor',
      isOwner: user?.role === 'Owner',
      isAdminOrOwner: user?.role === 'Admin' || user?.role === 'Owner',
    }
    setUser(uData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  return {
    user,
    isViewer: user?.role === 'Viewer',
    isAdmin: user?.role === 'Admin',
    isEditor: user?.role === 'Editor',
    isOwner: user?.role === 'Owner',
    isAdminOrOwner: user?.role === 'Admin' || user?.role === 'Owner',
  }
}
