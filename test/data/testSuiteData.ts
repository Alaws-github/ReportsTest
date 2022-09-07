export const testSuiteData = {
  importSuites: {
    positiveImport: {
      excelFile: 'upload/posExcel.xlsx',
      testCases: [
        'User can see all buttons',
        'User can see that their password is replaced with dots',
        'User is directed to proper pages from links',
      ],
      // other fields that should NOT be in "title" section to assert against
      negativeTitles: [
        'able to see difference',
        'User cannot see their password',
        'user has to navigate'
    ],
      title: 'test import title',
      description: 'test import description',
    },
    negativeImport: {
      excelFile: 'upload/negExcel.xlsx',
      title: 'test import negative title',
      description: 'test import negative description',
    },
    xlsImport: {
        excelFile: 'upload/positiveExcel.xls',
        testCases: [
          'user is able to navigate',
          'user can use links',
          'user can shut app off',
        ],
         // other fields that should NOT be in "title" section to assert against 
        negativeTitles: [
            'user must have an account',
            'user must be logged in',
            'user cannot have two accounts'
        ],
        title: 'test admin import title2',
        description: 'test admin import description2',
      },
  },

  templates: {
    blockchain: {
      templateName: 'blockchain',
      testCases: [
        'Transactions propagate to connected peers',
        'Mined blocks propagate to connected peers',
        'Nodes can leave and re-join the network',
        'Blockchain can handle hard forks',
        'Blockchain can handle soft forks',
        'Nodes with the same Genesis can form a network'
      ],
    },
    eCommerce: {
        templateName: 'E-commerce',
        testCases: [
          'Verify that a user is unable to exceed the extent of the inventory.',
          'Verify that user is able to get product details.',
          'Verify that a user CAN login with a valid email and password',
          'Verify that a user CANNOT login with a valid email and an invalid password',
          'Verify that a user CANNOT login with a valid email and NO password',
          'Verify that a user CANNOT login with an invalid email and password'
        ],
      },
    gaming: {
      templateName: 'gaming',
      testCases: [
        'Verify menu option.',
        'Verify user is able to turn background music on & off in App.',
        'Verify user is able to receive calls while game is running. ',
        'Verify sound effects in game are in sync with action.',
        'Verify device sound.',
        'Verify if vibration is present in game.'
      ],
    },

    mobile: {
      templateName: 'mobile',
      testCases: [
        'Verify user is able to download the App to their mobile device.',
        'Verify user is unable to download the App to their mobile device.',
        'Verify user is able to download the App to their mobile device.',
        'Verify user is able to download the App when device is charged.',
        'Verify user is unable to download the App when their device is not charged.',
        'Verify the App has been tested on different operating systems.'
      ],
    },

    usability: {
      templateName: 'usability',
      testCases: [
        'Page elements do not resemble advertising banners or chat indicators too closely. ',
        'Color is used to establish relationships.',
        'Color supports the primary intent of the interface.',
        'Color has appropriate contrast ratios.',
        'Use of color supports cultural norms and expectations in the interface.',
        'Form elements match the data needed',
      ],
    },
    web: {
      templateName: 'web',
      testCases: [
        'Verify that a user CANNOT login with a valid email and invalid password.',
        'Verify that user is not able to enter alphanumeric keys in form fields that should only accept numbers.',
        'Verify that a user CAN login with a valid email and password.',
        'Verify that a user CANNOT login with a valid email and NO password.',
        'Verify that a user CANNOT login with an invalid email and password.',
        'Verify that a user CANNOT login without an email/username.',
      ],
    },
  },
}