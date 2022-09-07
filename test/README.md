# Automated Tests with [Playwright](https://playwright.dev)

## Getting Started

### Install Dependencies

```sh
npm install
```

### Running Tests

```sh
npm run test:e2e # runs all tests and all browsers

npm run test:e2e -- --headed #runs all tests on all browsers with the process showing

npm run test:e2e:local #Script to run test on chrome

npm run test:e2e -- --project=edge # runs tests on specific browsers[chrome|firefox|edge|safari]

npm run test:e2e -- --grep @login # runs tagged tests

npm run test:e2e:local -- --headed #run chrome with browser showing
```
