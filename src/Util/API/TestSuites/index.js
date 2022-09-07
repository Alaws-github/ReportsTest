import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'
import {
  templatesApiRequest,
  apiRequest,
  suiteUploadApiRequest,
} from '../../util'

export const uploadCustomSuite = (
  options,
  file,
  statusCallback,
  successCallback
) => {
  // sleep time expects milliseconds
  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  return new Promise((reject, resolve) => {
    const responseObject = {
      success: false,
      error: null,
      body: null,
      message: null,
    }
    return suiteUploadApiRequest('get-signed-url', 'POST', options)
      .then(({ signedUrl: url }) => {
        statusCallback('Uploading...')
        const requestOptions = {
          headers: {
            'Content-Type': file.type,
          },
        }
        return axios
          .put(url, file, requestOptions)
          .then((response) => {
            statusCallback('Processing...')
            return sleep(5000)
          })
          .then(() => {
            return templatesApiRequest(
              `get-upload-status?uploadId=${options.uploadId}`
            )
              .then((response) => {
                responseObject.body = response
                responseObject.success = true
                successCallback(responseObject)
                resolve(responseObject)
              })
              .catch((error) => {
                console.log('getting upload status' + error)
                responseObject.error = error
                responseObject.message =
                  'Could not process the file. Please try again later.'
                reject(responseObject)
              })
          })
          .catch((error) => {
            console.log('uploading to S3: ' + error)
            responseObject.error = error
            responseObject.message = 'Could not upload. Please try again later.'
            reject(responseObject)
          })
      })
      .catch((error) => {
        console.log('getting pre-signed URL: ' + error)
        responseObject.error = error
        responseObject.message = 'Could not upload. Please try again later.'
        reject(responseObject)
      })
  })
}

/**
 * Gets a list of all test suite templates
 * @returns Array of test suite templates
 */

function sortTemplates(templates) {
  templates.sort((a, b) => a.title.localeCompare(b.title))
  return templates
}
export const useGetSuiteTemplateList = () => {
  // Unique cache key for this query
  const cacheKey = 'testSuiteTemplates'
  const query = () =>
    templatesApiRequest('list-test-suite-templates').then((templates) => {
      return sortTemplates(templates)
    })
  return useQuery(cacheKey, query, { refetchOnWindowFocus: false })
}

/**
 * Gets a list of test cases for a given test suite ID
 * @param {string} suiteId
 * @returns list of test cases
 */
export const useGetTestSuiteTemplateBySuiteId = (suiteId) => {
  // Unique cache key for this query
  const cacheKey = ['testSuiteTemplate', { suiteId: suiteId }]

  const query = () =>
    templatesApiRequest(`list-test-case-by-suiteId?suiteId=${suiteId}`)

  return useQuery(cacheKey, query, {
    enabled: !!suiteId,
    refetchOnWindowFocus: false,
  })
}

/**
 * Gets a list of sites for a given project
 * @param {string} projectId
 * @returns list of test cases
 */
export const useGetTestSuiteByProjectId = (projectId) => {
  // Unique cache key for this query
  const cacheKey = ['testSuites', { projectId }]

  const query = () =>
    apiRequest(`list-test-suite-by-projectId?projectId=${projectId}`)

  return useQuery(cacheKey, query, {
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  })
}

//Hook for interacting with the Test Suite API
export function useTestSuitesMutation() {
  const queryClient = useQueryClient()

  // Create a test suite
  const createTestSuite = (data) => {
    return apiRequest('add-test-suite', 'POST', data).then((testSuite) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('testSuites')
      return testSuite
    })
  }

  // Edit test suite
  const editTestSuite = (data) => {
    return apiRequest('update-test-suite', 'POST', data).then((testSuite) => {
      queryClient.invalidateQueries('testSuites')
      return testSuite
    })
  }

  // Delete a test suite
  const deleteTestSuite = (suiteId) => {
    return apiRequest(
      `delete-test-suite?testSuiteId=${suiteId}`,
      'DELETE'
    ).then((testSuite) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('testSuites')
      return testSuite
    })
  }

  const getUploadStatus = (uid) => {
    return templatesApiRequest(`get-upload-status?uploadId=${uid}`).then(
      (uploadStatusResponse) => {
        if (uploadStatusResponse?.uploadStatus) {
          // Invalidate existing query for projects by owner so that it will
          // be refetched next time and include new item.
          queryClient.invalidateQueries('testSuites')
        }
        return uploadStatusResponse
      }
    )
  }
  return {
    createTestSuite,
    editTestSuite,
    deleteTestSuite,
    getUploadStatus,
  }
}
