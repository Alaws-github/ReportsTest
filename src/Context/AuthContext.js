import React, { useContext, useState, useEffect } from 'react'
import { Auth, Hub } from 'aws-amplify'
import { v4 as uuid } from 'uuid'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  useEffect(async () => {
    await Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          setCurrentUser(data)
          break
        case 'signOut':
          break
      }
    })
    await checkUser()
    setLoading(false)
  }, [])

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      setCurrentUser(user)
    } catch (error) {}
  }
  async function signUp(values) {
    const workspaceID = uuid()

    return await Auth.signUp({
      username: values.email,
      password: values.password,
      attributes: {
        email: values.email,
        given_name: values.firstName,
        family_name: values.lastName,
        'custom:workspaceID': workspaceID,
        'custom:workspaceName': values.workspaceName,
        'custom:license': !values?.priceId ? values.license : '',
        'custom:priceID': values.priceId,
      },
    })
  }
  async function signIn(values) {
    return await Auth.signIn({
      username: values.email,
      password: values.password,
    })
  }
  async function signOut() {
    try {
      await Auth.signOut()
      localStorage.clear()
      window.location.replace('/')
    } catch (error) {
      console.log('error signing out: ', error)
    }
  }
  async function sendResetPassword(email) {
    return await Auth.forgotPassword(email)
  }
  async function forgotPasswordSubmit(values) {
    return Auth.forgotPasswordSubmit(
      values.email,
      values.code.toString(),
      values.newPassword
    )
  }
  async function sendVerificationCode(username) {
    return await Auth.resendSignUp(username)
  }

  async function completeNewPassword(email, password, newPassword) {
    return Auth.signIn(email, password).then((user) => {
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        return Auth.completeNewPassword(
          user, // the Cognito User Object
          newPassword // the new password
        )
      } else {
        new Error('New password not required!')
      }
    })
  }

  const value = {
    currentUser,
    signUp,
    signIn,
    signOut,
    sendResetPassword,
    forgotPasswordSubmit,
    sendVerificationCode,
    completeNewPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
