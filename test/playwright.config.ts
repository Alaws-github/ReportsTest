//playwright.config.ts
require('dotenv').config()
import { PlaywrightTestConfig, devices } from '@playwright/test'
import { urls } from './urls'

let baseUrl = process.env.ENV

if (!baseUrl || !['dev', 'stg', 'prod'].includes(baseUrl)) {
  console.log(
    'No environment specified. Falling back to default environment (stg).'
  )

  baseUrl = 'stg'

}

const config: PlaywrightTestConfig = {
  reporter: [['list']],
  use: {
    baseURL: urls[baseUrl],
    headless: true,
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'safari',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
  ],
}
export default config
