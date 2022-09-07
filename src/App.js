import React, { useEffect, lazy, Suspense } from 'react'
import './App.less'
import { AuthProvider } from './Context/AuthContext'
import { UserProvider } from './Context/UserContext'
import { WorkspaceProvider } from './Context/WorkspaceContext'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './Components/Auth/PrivateRoute'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { SegmentProvider } from 'react-segment-hooks'
import { useScript } from './Hooks'
import PageLoader from './Components/Common/PageLoader'
import Projects from './Components/Projects/Projects'
import TestSuites from './Components/TestSuites/TestSuites'
import TestRuns from './Components/TestRuns'
import TestCases from './Components/TestCases/TestCases'
import Login from './Components/Auth/Login'
import Register from './Components/Auth/Register/index'
import ForgotPassword from './Components/Auth/ForgotPassword'
import ConfirmSignUp from './Components/Auth/ConfirmSignUp'
import InvitationSignUp from './Components/Auth/InvitationSignUp'
import Reports from './Components/Reports'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactGA from 'react-ga4'

const PublicReport = lazy(() => import('./Components/PublicReport'))
const NoMatch = lazy(() => import('./Components/404'))
const Report = lazy(() => import('./Components/Report'))
const TestRunner = lazy(() => import('./Components/TestRunner'))
const Overview = lazy(() => import('./Components/Overview/Overview'))
const Settings = lazy(() => import('./Components/Settings/workspaceSettings'))
const JiraSuccessScreen = lazy(() =>
  import('./Components/Integrations/JiraSuccessScreen')
)

const TRACKING_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
ReactGA.initialize(TRACKING_ID)

TimeAgo.addDefaultLocale(en)

function App() {
  const queryClient = new QueryClient()
  useScript('https://static.userback.io/widget/v1.js')

  useEffect(() => {
    window.Userback = window.Userback || {}
    window.Userback.access_token = process.env.REACT_APP_USERBACK_ACCESS_TOKEN
  }, [])

  useEffect(() => {
    ReactGA.send('pageview')
  }, [])

  return (
    <Suspense fallback={<PageLoader />}>
      <QueryClientProvider client={queryClient}>
        <SegmentProvider apiKey={process.env.REACT_APP_SEGMENT_ID}>
          <Router>
            <AuthProvider>
              <UserProvider>
                <WorkspaceProvider>
                  <Switch>
                    <Route
                      exact
                      path="/invitation/:encodedData"
                      component={InvitationSignUp}
                    />
                    <Route
                      exact
                      path="/confirm-signup/:encodedData"
                      component={ConfirmSignUp}
                    />
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/forgot-password" component={ForgotPassword} />
                    <Route
                      exact
                      path="/shareable-report/:id"
                      component={PublicReport}
                    />
                    <PrivateRoute
                      path="/jira-integration"
                      component={JiraSuccessScreen}
                    />
                    <PrivateRoute exact path="/" component={Projects} />
                    <PrivateRoute exact path="/projects" component={Projects} />
                    <PrivateRoute exact path="/settings" component={Settings} />
                    <PrivateRoute
                      exact
                      path="/:projectId/overview"
                      component={Overview}
                      isMainLayout={true}
                    />
                    <PrivateRoute
                      exact
                      path="/:projectId/test-runs"
                      component={TestRuns}
                      isMainLayout={true}
                    />
                    <PrivateRoute
                      exact
                      path="/:projectId/test-suites"
                      component={TestSuites}
                      isMainLayout={true}
                    />
                    <PrivateRoute
                      exact
                      path="/:projectId/test-cases/:id"
                      component={TestCases}
                      isMainLayout={true}
                    />
                    <PrivateRoute
                      exact
                      path="/:projectId/test-runner/:id"
                      component={TestRunner}
                      isMainLayout={true}
                    />
                    <PrivateRoute
                      exact
                      path="/:projectId/reports"
                      component={Reports}
                      isMainLayout={true}
                    />
                    <PrivateRoute
                      exact
                      path="/:projectId/reports/:id"
                      component={Report}
                      isMainLayout={true}
                    />
                    <Route component={NoMatch} />
                  </Switch>
                </WorkspaceProvider>
              </UserProvider>
            </AuthProvider>
          </Router>
        </SegmentProvider>
        <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
      </QueryClientProvider>
    </Suspense>
  )
}

export default App
