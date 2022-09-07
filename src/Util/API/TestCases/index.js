import { useQuery, useQueryClient } from 'react-query'
import { apiRequest } from '../../util'
import axios from 'axios'

function sortTestCases(testCases) {
  testCases.sort((a, b) => a.index - b.index)
  return testCases
}

/**
 * Gets a list of all test cases
 * @returns Array of test cases
 */
export const useGetTestCaseList = ({ customSuiteId, projectId }) => {
  // Unique cache key for this query
  const cacheKey = ['testCases', { customSuiteId: customSuiteId }]

  const query = () =>
    apiRequest(
      `list-test-case-by-suiteId?customSuiteId=${customSuiteId}&projectId=${projectId}`
    ).then((testSuiteData) => {
      const { testCases } = testSuiteData
      let categories = testCases.map((tc) => tc.category)
      categories = [...new Set(categories)]
      const _testCases = testCases.map((tc) => {
        return {
          ...tc,
          key: tc.id,
        }
      })
      return {
        testCases: sortTestCases(_testCases),
        categories,
        testSuiteInfo: {
          title: testSuiteData.title,
          id: testSuiteData.suiteId,
          customId: testSuiteData.customId,
          description: testSuiteData.description,
        }
      }
    })
  return useQuery(cacheKey, query, {
    enabled: !!customSuiteId && !!projectId,
  })
}

export function useGetSectionList({ customSuiteId, projectId }) {
  const cacheKey = ['sections', { customSuiteId }]
  const query = () =>
    apiRequest(`list-section-by-suiteId?customSuiteId=${customSuiteId}&projectId=${projectId}`).then(
      (sections) => {
        return sections.map((s) => {
          return {
            ...s,
            type: 'section',
            key: s.id,
          }
        })
      }
    )
  return useQuery(cacheKey, query, {
    enabled: !!customSuiteId && !!projectId,
  })
}

//Hook for interacting with the Test Case API
export function useTestCasesMutation() {
  const queryClient = useQueryClient()

  // Create a test suite
  const createTestCase = (data) => {
    return apiRequest('add-test-case', 'POST', data).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('sections')
      queryClient.invalidateQueries('testCases')
      return response
    })
  }

  //Update test case
  const updateTestCase = (data) => {
    return apiRequest('update-test-case', 'POST', data).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('sections')
      queryClient.invalidateQueries('testCases')
      return response
    })
  }

  //Update test case index
  const updateTestCaseIndex = ({
    testCaseId,
    prevIndex,
    nextIndex,
    sectionId,
  }) => {
    const data = {
      testCaseId,
      prevIndex,
      nextIndex,
      sectionId,
    }
    return apiRequest('update-test-case-index', 'POST', data).then(
      (response) => {
        // // Invalidate existing query for projects by owner so that it will
        // // be refetched next time and include new item.
        // queryClient.invalidateQueries('sections')
        queryClient.invalidateQueries('testCases')
        return response
      }
    )
  }

  // Delete test cases/s
  const deleteTestCase = (data) => {
    return apiRequest(`delete-test-case`, 'DELETE', data).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('sections')
      queryClient.invalidateQueries('testCases')
      return response
    })
  }

  // Create section
  const createSection = (data) => {
    return apiRequest(`add-section`, 'POST', data).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('sections')
      queryClient.invalidateQueries('testCases')
      return response
    })
  }

  // Update section
  const updateSection = ({ sectionId, name }) => {
    return apiRequest(`update-section-by-id?sectionId=${sectionId}`, 'POST', {
      name,
    }).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('sections')
      queryClient.invalidateQueries('testCases')
      return response
    })
  }

  // Delete section
  const deleteSection = ({ sectionId }) => {
    return apiRequest(
      `delete-section?sectionId=${sectionId}`,
      'DELETE',
      null
    ).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('sections')
      queryClient.invalidateQueries('testCases')
      return response
    })
  }
  return {
    createSection,
    createTestCase,
    deleteTestCase,
    updateTestCase,
    updateSection,
    deleteSection,
    updateTestCaseIndex,
  }
}

export const gpt3TestCases = (requirement) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': `${process.env.REACT_APP_GENERATE_TEST_CASE_API_KEY}`,
    },
  }

  const data = {
    requirement: requirement.replace(/\n/g, '\\n'),
  }

  return axios
    .post(process.env.REACT_APP_GENERATE_TEST_CASE_API, data, options)
    .then((response) => {
      const { data } = response

      if (data?.body) {
        const parsedData = JSON.parse(data?.body)
        let _data = parsedData.choices[0]?.text
        _data = _data.includes('Test Case :')
          ? _data.split('Test Case :')[1]
          : _data
        return _data
          .split('\\n')
          .filter((tc) => {
            if (!tc || tc === '') return false
            return true
          })
          .map((tc) => {
            return {
              title: tc,
              added: false,
            }
          })
      } else {
        return []
      }
    })
}
