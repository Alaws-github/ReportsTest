import { reportServiceRequest, sortByDate } from '../../util'
import { useQuery, useQueryClient } from 'react-query'

export function useReportServiceMutation() {
  const queryClient = useQueryClient()
  const generateReport = (reportDetails) => {
    return reportServiceRequest('generate-report', 'POST', reportDetails)
  }

  const generateShareableReport = (report_id) => {
    return reportServiceRequest(`generate-shareable-report`, 'POST', {
      report_id,
    }).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('report')
      return response
    })
  }

  const deleteReport = (report_id) => {
    return reportServiceRequest(
      `delete-report?reportId=${report_id}`,
      'DELETE'
    ).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('reports')
      return response
    })
  }

  const updateReport = (report_id, reportDetails) => {
    return reportServiceRequest(`update-report?reportId=${report_id}`, 'POST', {
      ...reportDetails,
    }).then((response) => {
      // Invalidate existing query for projects by owner so that it will
      // be refetched next time and include new item.
      queryClient.invalidateQueries('reports')
      return response
    })
  }

  return {
    deleteReport,
    generateReport,
    updateReport,
    generateShareableReport,
  }
}

export function useGetReportById(reportId) {
  // Unique cache key for this query
  const cacheKey = ['report', { reportId }]

  const query = () =>
    reportServiceRequest(`get-report-by-id?reportId=${reportId}`).then(
      (response) => response
    )

  return useQuery(cacheKey, query, {
    enabled: !!reportId,
  })
}

export function useGetReportsByProjectId(projectId) {
  // Unique cache key for this query
  const cacheKey = ['reports', { projectId }]

  const query = () =>
    reportServiceRequest(
      `list-report-by-projectId?projectId=${projectId}`
    ).then((response) => sortByDate(response, 'created_at'))

  return useQuery(cacheKey, query, {
    enabled: !!projectId,
  })
}

export function useGetShareableReportById(shareableReportId) {
  // Unique cache key for this query
  const cacheKey = ['shareable-report', { shareableReportId }]

  const query = () =>
    reportServiceRequest(
      `get-shareable-report-by-id?id=${shareableReportId}`,
      'GET',
      null,
      process.env.REACT_APP_REPORT_API_KEY
    ).then((response) => response)

  return useQuery(cacheKey, query, {
    enabled: !!shareableReportId,
  })
}
