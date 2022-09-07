import { useQuery, useQueryClient, useQueries } from 'react-query'
import { testRunnerApiRequest, apiRequest } from '../../util'

/**
 * Gets a list of run summaries for a given project
 * @param {string} projectId
 * @returns list of test runs
 */
export const useGetTestSuiteWithCases = (testSuites) => {
  testSuites = testSuites || []

  return useQueries(
    testSuites.map((testSuite, index) => {
      return {
        queryKey: ['testSuite', testSuite.id],
        queryFn: () =>
          apiRequest(`list-test-case-by-suiteId?suiteId=${testSuite.id}`).then(
            (testCaseResponse) => {
              const { testCases } = testCaseResponse
              const testSuiteId = testSuites?.[index]?.id
              const children = testCases?.map((tc) => {
                return {
                  ...tc,
                  testSuiteId,
                  testCaseId: tc.id,
                }
              })
              const data = {
                ...testSuites[index],
                numberOfTestCases: testCases?.length || 0,
              }
              if (children?.length > 0) data['children'] = children
              return data
            }
          ),
        enabled: !!testSuite.id,
        refetchOnWindowFocus: false,
      }
    })
  )
}

export const useGetSectionsForSuites = (testSuites) => {
  testSuites = testSuites || []

  return useQueries(
    testSuites.map((testSuite, index) => {
      return {
        queryKey: ['sections', testSuite.id],
        queryFn: () =>
          apiRequest(`list-section-by-suiteId?suiteId=${testSuite.id}`).then(
            (sectionResponse) => {
              const testSuiteId = testSuites[index].id
              return {
                testSuiteId: testSuiteId,
                sections: sectionResponse.map((section) => {
                  return {
                    ...section,
                    testSuiteId,
                    sectionId: section.id,
                    type: 'section',
                  }
                }),
              }
            }
          ),
        enabled: !!testSuite.id,
        refetchOnWindowFocus: false,
      }
    })
  )
}

/**
 * Gets a list of runs for a given project
 * @param {string} projectId
 * @returns list of test runs
 */
export const useGetTestRunsByProjectId = (projectId) => {
  // Unique cache key for this query
  const cacheKey = ['testRunsByProject', { projectId }]

  const query = () =>
    testRunnerApiRequest(
      `get-project-test-run-summary?projectId=${projectId}`
    ).then((response) =>
      response.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return 1
        }
        if (a.createdAt > b.createdAt) {
          return -1
        }
      })
    )

  return useQuery(cacheKey, query, {
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  })
}

//Hook for interacting with the Test Suite API
export function useTestRunsMutation() {
  const queryClient = useQueryClient()

  // Create a test suite
  const createTestRun = (data) => {
    return testRunnerApiRequest('add-test-execution', 'POST', data).then(
      (response) => {
        // Invalidate existing query for projects by owner so that it will
        // be refetched next time and include new item.
        queryClient.invalidateQueries('testRunsByProject')
        return response
      }
    )
  }

  const updateTestRun = (data) => {
    return testRunnerApiRequest('update-test-execution', 'POST', data).then(
      (response) => {
        // Invalidate existing query for projects by owner so that it will
        // be refetched next time and include new item.
        queryClient.removeQueries('testRunsByProject')
        return response
      }
    )
  }

  // Delete a test
  const deleteTestRun = (runId) => {
    return testRunnerApiRequest(
      `delete-test-execution?id=${runId}`,
      'DELETE'
    ).then((testRun) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('testRunsByProject')
      return testRun
    })
  }

  return {
    createTestRun,
    updateTestRun,
    deleteTestRun,
  }
}
