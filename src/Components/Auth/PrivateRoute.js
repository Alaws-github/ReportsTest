import React from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import MainLayout from '../Layout/MainLayout'

function PrivateRoute({ component: Component, isMainLayout = false, ...rest }) {
  const { currentUser } = useAuth()
  const location = useLocation()
  const params = new URLSearchParams(location?.search)
  params.append('nextPage', location?.pathname)

  const renderPage = (props) => {
    if (isMainLayout) {
      return (
        <MainLayout>
          <Component {...props} />
        </MainLayout>
      )
    }
    return <Component {...props} />
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          renderPage(props)
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              search: params.toString(),
            }}
          />
        )
      }}
    ></Route>
  )
}

export default PrivateRoute
