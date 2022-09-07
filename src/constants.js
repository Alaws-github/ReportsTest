module.exports = {
  statusColors: {
    passed: '#389E0D',
    failed: '#CF1322',
    blocked: '#FAAD14',
    skipped: '#408FF7',
    not_executed: '#BFBFBF',
    'not executed': '#BFBFBF',
  },
  referenceToolTips: {
    referenceId:
      'This ID is the user friendly KEY/ID that is given to your requirements in an external system. Example QWAT-345',
    referenceUrl:
      'This is the full URL to your requirements that is in an external system. Example: https://company.atlassian.net/browse/QWAT-345',
  },
  automationToolTips: {
    time: 'The time it took to execute the test with automation.',
  },
  plans: {
    'qw:basic:3': {
      title: 'Basic',
      features:
        '3 Users, 1 Project , All Templates, Access to AI Test Case Generation, Unlimited Test Cases, Unlimited Suites, 1000 Test Runs, Unlimited Reports, Unlimited Automation Requests, $25 for Additional User',
    },
    'qw:startup:10': {
      title: 'Startup',
      features:
        '10 Users, 5 Projects, All Templates, Access to AI Test Case Generation, Unlimited Test Cases, Unlimited Suites, 5000 Test Runs, Unlimited Reports, Unlimited Automation Requests, $20 for Additional User',
    },
    'qw:professional:20': {
      title: 'Professional',
      features:
        '20 Users, 50 Projects, All Templates, Access to AI Test Case Generation, Unlimited Test Cases, Unlimited Suites, 50000 Test Runs, Unlimited Reports, Unlimited Automation Requests, $18 for Additional User',
    },
    'qw:enterprise': {
      title: 'Enterprise',
      features:
        'Unlimited Projects, All Templates, Access to AI Test Case Generation, Unlimited Test Cases, Unlimited Suites, Unlimited Test Runs, Unlimited Reports, Unlimited Automation Requests',
    },
  },
  planPrettyName: {
    whitelist: 'Custom',
    basic: 'Basic',
    startup: 'Startup',
    professional: 'Professional',
    enterprise: 'Enterprise',
  },
  documentationLink: 'https://www.docs.qualitywatcher.com/docs/category/guides',
  qualitywatcherHome: {
    staging: 'https://staging7.qualitywatcher.com',
    production: 'https://www.qualitywatcher.com'
  }
}
