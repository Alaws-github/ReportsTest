import { convertToMarkdown } from '../util'
const doc = {
  fields: {
    project: {
      key: '[JIRA_PROJECT]',
    },
    summary: '[JIRA_TITLE]',
    description: null,
    issuetype: {
      name: 'Bug',
    },
  },
}

const markdown = `
**Preconditions:**

[PRECONDITION]

**Steps to Reproduce:**

[STEPS]

**Expected Results:**

[EXPECTED_RESULTS]

**Actual Results:**

[ACTUAL_RESULTS]

----

Additional Details: 

> Test Run: [TEST_RUN_NAME]([TEST_RUN_LINK])

> Suite: [TEST_SUITE_NAME]

> Tags: [TAG_PRIORITY] [TAG_SECTION] [TAG_CATEGORY]



`

const createJiraMarkdown = (data) => {
  let _markdown = markdown

  _markdown = markdown.replace('TEST_RUN_NAME', data.testRunTitle)
  _markdown = _markdown.replace('[TEST_RUN_LINK]', data.testRunLink)
  _markdown = _markdown.replace('[TEST_SUITE_NAME]', data.suiteTitle)

  _markdown = _markdown.replace(
    '[TAG_PRIORITY]',
    data.priority ? `\`${data.priority}\` |` : ''
  )

  _markdown = _markdown.replace(
    '[TAG_SECTION]',
    data.section ? `\`${data.section}\` |` : ''
  )

  _markdown = _markdown.replace(
    '[TAG_CATEGORY]',
    data.category ? `\`${data.category}\`` : ''
  )

  _markdown = _markdown.replace(
    '[PRECONDITION]',
    data.precondition ? convertToMarkdown(data.precondition) : ''
  )
  _markdown = _markdown.replace(
    '[STEPS]',
    data.body ? convertToMarkdown(data.body) : ''
  )
  _markdown = _markdown.replace(
    '[EXPECTED_RESULTS]',
    data.expectedResults ? convertToMarkdown(data.expectedResults) : ''
  )
  //actual results
  if (data?.comment?.length !== 0) {
    _markdown = _markdown.replace(
      '[ACTUAL_RESULTS]',
      convertToMarkdown(
        data?.comment ? convertToMarkdown(data.comment[0].body) : ''
      )
    )
  }

  _markdown = _markdown.replaceAll('<!-- -->', '')

  return _markdown
}

const createJiraIssue = (data) => {
  doc.fields.project.key = data.projectKey
  doc.fields.summary = `[TC${data.customId}] - FAILED: ${data?.title}`
  doc.fields.description = createJiraMarkdown(data)
  return doc
}

export default createJiraIssue
