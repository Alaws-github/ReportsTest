import { Auth } from 'aws-amplify'
import axios from 'axios'
import * as Showdown from 'showdown'
import { utcToZonedTime, format } from 'date-fns-tz'
import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-jdenticon-sprites'
import svgToMiniDataURI from 'mini-svg-data-uri'
import environmentalVariables from './env'
import * as prettyMilliseconds from 'pretty-ms'

const showdown = new Showdown.Converter()

const {
  general,
  testRunner,
  templates,
  fileUpload,
  user,
  suiteUpload,
  workspace,
  email,
  jira,
  ai,
  report,
  key,
  stripe,
} = environmentalVariables

/**
 * API helper for interesting with Projects, Test Suites, and Test Cases
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function apiRequest(path, method, data) {
  return request(path, method, data, general.base_url)
}

/**
 * API helper for interacting with templates
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function templatesApiRequest(path, method, data) {
  return request(path, method, data, templates.base_url)
}

/**
 * API helper for interacting with the Test Runner
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function testRunnerApiRequest(path, method, data) {
  return request(path, method, data, testRunner.base_url)
}

/**
 * API helper for interacting with File Upload Service
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function fileUploadApiRequest(path, method, data) {
  return request(path, method, data, fileUpload.base_url)
}

/**
 * API helper for interacting with Suite Upload Service
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function suiteUploadApiRequest(path, method, data) {
  return request(path, method, data, suiteUpload.base_url)
}

/**
 * API helper for interacting with User Persona Service
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function userApiRequest(path, method, data, useApiKey) {
  const apiKey = useApiKey ? process.env.REACT_APP_PERSONA_API_KEY : undefined
  return request(path, method, data, user.base_url, apiKey)
}

/**
 * API helper for interacting with Workspace Service
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function workspaceApiRequest(path, method, data) {
  return request(path, method, data, workspace.base_url)
}

/**
 * API helper for interacting with Email Service
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function emailApiRequest(path, method, data) {
  const apiKey = process.env.REACT_APP_EMAIL_API_KEY
  return request(path, method, data, email.base_url, apiKey)
}

/**
 * API helper for interacting with Email Service
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function jiraIntegrationRequest(path, method, data) {
  return request(path, method, data, jira.base_url)
}

/**
 * API helper for interacting with AI Service
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function aiServiceRequest(path, method, data) {
  return request(path, method, data, ai.base_url)
}

/**
 * API helper for interacting with Report Service
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function reportServiceRequest(path, method, data, apiKey) {
  return request(path, method, data, report.base_url, apiKey)
}

/**
 * API helper for interacting with KEY Service
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function keyServiceRequest(path, method, data, apiKey) {
  return request(path, method, data, key.base_url, apiKey)
}

/**
 * API helper for interacting with Stripe Service
 *
 * @param {string} path - path to api excluding backlash
 * @param {string} [method=GET] - api method GET | DELETE | POST | PUT
 * @param {object} [data]
 * @returns {Promise} response
 */
export function billingServiceRequest(path, method, data, apiKey) {
  return request(path, method, data, stripe.base_url)
}

/**
 * Helper function for getting the current user access token from Amplify
 * @returns {string} user access token
 */
async function getAuthToken() {
  const user = await Auth.currentAuthenticatedUser()
  const token = user.signInUserSession.idToken.jwtToken
  return token
}

const request = async (path, method = 'GET', data, baseUrl, apiKey) => {
  const accessToken = !apiKey ? await getAuthToken() : null

  return axios(`${baseUrl}/${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      'X-API-KEY': apiKey ? apiKey : undefined,
    },
    data: data ? JSON.stringify(data) : undefined,
  })
    .then((response) => response)
    .then((response) => {
      if (response?.data?.error && response?.data?.code === 403) {
        window.location.href = '/'
        return
      }
      if (response.status === 'error') {
        // Automatically signout user if accessToken is no longer valid
        if (response.code === 'auth/invalid-user-token') {
          Auth.signOut()
        }

        throw new CustomError(response.code, response.message)
      } else {
        return response.data
      }
    })
    .catch((error) => {

      if (error?.response?.data?.code === 403) {
        window.location.href = '/'
        return
      }

      if (error?.response && error?.response?.data?.error?.message) {
        const message = error?.response?.data?.error?.message
        throw new CustomError(error.response.status, message)
      }
      if (error?.response && Array.isArray(error?.response?.data)) {
        throw error?.response?.data
      }
      throw new CustomError(error.response.status, error.message)
    })
}

// Create an Error with custom message and code
export function CustomError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}

/**
 * @param {Number} partialValue
 * @param {Number} totalValue
 * @return {Number} - Will return the actual percentage
 */
export const calculatePercentage = (partialValue, totalValue) => {
  return (partialValue / totalValue) * 100
}

/**
 *
 * @param {*} data
 * @returns
 */
export const calculateSummaryPercentages = (data) => {
  if (!data) return {}

  const completed = calculatePercentage(
    data.case_count - data.not_executed,
    data.case_count
  )
  const passed = calculatePercentage(data.passed, data.case_count)
  const failed = calculatePercentage(data.failed, data.case_count)
  const not_executed = calculatePercentage(data.not_executed, data.case_count)
  const blocked = calculatePercentage(data.blocked, data.case_count)
  const skipped = calculatePercentage(data.skipped, data.case_count)

  return {
    completed,
    passed,
    failed,
    blocked,
    skipped,
    not_executed,
  }
}

const tracker = (eventName, evenProperties = {}) => {
  try {
    window?.analytics?.track(eventName, evenProperties)
  } catch (error) {
    console.log('Could not save usage information')
  }
}

export const analyticsActions = {
  templateSuiteCreated: (templateId, caseIds) =>
    tracker('Template Suite Created', { templateId, caseIds }),
  customSuiteCreated: () => tracker('Custom Suite Created'),
  login: (details) => {
    const { userId, email } = details
    window?.analytics?.identify(userId, { email })
    tracker('User Login', { ...details })
  },
  register: (email) => tracker('User Registered', { email }),
  inviteRegister: (email) => tracker('Invited: User Registered', { email }),
  confirmedEmail: (details) =>
    tracker(
      details.status === 'failed'
        ? 'User Confirmed Email : Failed'
        : 'User Confirmed Email',
      { ...details }
    ),
  createProject: () => tracker('Project Created'),
  addTestSuitePrimary: () => tracker('Add Test Suite: Primary Button'),
  addTestSuiteEmpty: () => tracker('Add Test Suite: Empty Button'),
  qualityMeterInterest: (value) => tracker(`Quality Meter Interest : ${value}`),
}

export const isGPT3Enabled = () =>
  process.env.REACT_APP_BASE_URL_AI_DEV ||
  process.env.REACT_APP_BASE_URL_AI_STG ||
  process.env.REACT_APP_BASE_URL_AI

export const getJiraAuthLink = (userId) => {
  let linkRef = process.env.REACT_APP_JIRA_AUTH_LINK
  linkRef = linkRef.replace('[USER_ID]', userId)
  return linkRef
}

const isHTML = (source) =>
  /<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/i.test(
    source
  )

export const convertToHTML = (source) => {
  if (isHTML(source)) {
    return source
  }
  return showdown.makeHtml(source) //markdown to HTML
}

export const convertToMarkdown = (source, isCKEditor = false) => {
  const figureReg1 = /<figure class="image"><img[^>]+src="([^">]+)"><\/figure>/gm
  const figureReg2 = /<figure class="image"><img[^>]+src="([^">]+)" alt=""><\/figure>/gm
  if (!isHTML(source)) {
    return source
  }

  let md = showdown.makeMarkdown(source) //HTML to markdown

  if (figureReg1.test(source)) {
    // check for images and convert them to JIRA markdown
    const matches = md.match(figureReg1) || []

    if (matches.length > 0) {
      matches.forEach((match, index) => {
        let matchReplace = match.replace(figureReg1, '![]($1)')
        md = md.replace(match, matchReplace)
      })
    }
  }

  if (figureReg2.test(source)) {
    // check for images and convert them to JIRA markdown
    const matches = md.match(figureReg2) || []

    if (matches.length > 0) {
      matches.forEach((match, index) => {
        let matchReplace = match.replace(figureReg2, '![]($1)')
        md = md.replace(match, matchReplace)
      })
    }
  }

  if (isCKEditor) {
    md = md.replaceAll('<!-- -->', '')
    md =
      md +
      '\n\n\n\n###### *Issue generated by [QualityWatcher](https://qualitywatcher.com)*'
  }

  return md
}

export const utcToZonedTimeFormat = (utcDate, pattern = 'PP, p') => {
  if (utcDate) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const date = new Date(utcDate)
    const userTimeZoneDate = utcToZonedTime(date, userTimeZone)
    const formattedTimeZonedDate = format(userTimeZoneDate, pattern, {
      timeZone: userTimeZone,
    })
    return formattedTimeZonedDate
  }

  return ''
}

export const createProjectIcon = (projectName) => {
  const svg = createAvatar(style, {
    seed: projectName,
    background: '#FFF',
  })
  return svgToMiniDataURI(svg)
}

export const sortByDate = (array, key) => {
  return array.sort((a, b) => {
    return new Date(b[key]) - new Date(a[key])
  })
}

export const msToTime = (ms) => {
  return prettyMilliseconds(ms)
}

export const base64ToJSON = (data) => {
  const stringifyJSON = Buffer.from(data, 'base64').toString('utf8')
  return JSON.parse(stringifyJSON)
}

export const flatten = (into, node) => {
  if (node == null) return into
  if (Array.isArray(node)) return node.reduce(flatten, into)
  into.push(node)
  return flatten(into, node.children)
}
