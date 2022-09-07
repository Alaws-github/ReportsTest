import React, { useContext, useState, useEffect } from 'react'
import { useGetWorkspace } from '../Util/API/Workspace'
import { useUser } from './UserContext'
import { useHistory } from 'react-router-dom'

const WorkspaceContext = React.createContext()

export function useWorkspace() {
  return useContext(WorkspaceContext)
}

export function WorkspaceProvider({ children }) {
  const [workspace, setWorkspace] = useState()
  const {
    user,
    isAdminOrOwner,
    isViewer,
    isOwner,
    isAdmin,
    isEditor,
  } = useUser()
  const { data: workspaceData, isLoading } = useGetWorkspace(user)
  const history = useHistory()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    setWorkspace({
      ...workspaceData,
      user,
      isAdminOrOwner,
      isViewer,
      isOwner,
      isAdmin,
      isEditor,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceData, user])

  function getProject(customId) {
    const project = workspace?.projects?.find((p) => p.customId === Number(customId))
    if (!project && workspace?.projects?.length > 0) history.push('/')
    return project
  }

  const value = {
    isLoading,
    getProject,
    ...workspace,
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}
