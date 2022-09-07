<p align="center">
    <img src="https://app.qualitywatcher.com/image/onboarding/Welcome.png" alt="qualitywatcher app" width="100%" height="100%" style="border-radius: 25px;"/>
  <p align="center">This project contains the QualityWatcher Frontend, and it's created using React.</p>
</p>

---

# Getting Started

1. Clone and install:

```sh
git clone https://github.com/QualityWorksCG/app.qualitywatcher.git
```

```sh
cd app.qualitywatcher
npm install
```

2. Request environmental variables

> To successfully run this app locally you would need all of the dev environmental variables. Please reach out to Dimitri Harding

    2a. Created a .env.local file in the root of the project and then paste variables there.

3. Run the application

```sh
npm run start # The application will start on localhost:3000
```

---

# Technologies

> The main technologies that are used in this project

- [React Create App](https://create-react-app.dev)
- [Antd](https://ant.design) - Design System
- [React Query](https://react-query.tanstack.com) - Fetch, cache and update data
- [AWS Amplify Package](https://www.npmjs.com/package/aws-amplify) - Authentication

# Project Structure

```
|- package.json
|- craco.config.js
|- .aws
    |- buildspec.dev.yml
    |- buildspec.stg.yml
    |- buildspec.yml
|- src
    |- assets
    |- Components
       |- Common
       |- Projects
       |- ...
    |- Context
    |- Hooks
    |- Util
       |- API
          |- Projects
          |- ...
       |- util.js
       |- env.js
    |- App.js
    |- constants
```

`/src/` - contains the application project. This is all the source code point the application.

`/src/App.js` - main application entry point. Contains routes and context providers.

`/src/Components` - contains the all the UI components. Each component folder represents a page or section

`/src/Components/Common` - contains common components that can be used in multiple pages or sections

`/src/Components/Layout` - contains layout components for the entire app. When adding menu items start here

`/src/Context` - contains all context components. Currently there is Auth, User, and Workspace, which can be used any component to get relevant information

`/src/Util` - contains helper functions and APIs for interacting with data

`/src/Util/util.js` - contains helper functions.

`/src/Util/API` - contains all of the API interactions. Each folder represents a page or section like the components folder

`/src/Util/env.js` - contains mappings of all API endpoints to variables

`/src/constants.js` - contains copy and other constant information for the app. Allows for easy update of copy overtime

# Contribution

QualityWatcher App uses continuous integration where once changes are merged into dev, it's built and pushed to dev.qualitywatcher.com and the same for staging and production branches.

This project has 3 important branches that should never be deleted:

- `dev` - All new branches should be created from this branch (feature/[ticket id]-branch-name)
- `stg` - Only `dev` should be merged into `stg` (promote to staging/QA)
- `main` - Only `stg` should be merged into this branch, if there is an hot-fix then you work on main and push directly to it, and then add then changes to dev (Production deployment)

> Any code that is in those 3 branches will be automatically deployed to the relative environments

Working on a feature:

- Pull the latest from `dev`
- Create your feature branch `git checkout -b feature/QWAT-###-feature-name`
- Create Pull Request with all of the relevant information
- Fix issues and answer questions for PR
- Once PR is merged, confirm changes in `https://dev.qualitywatcher.com`
- Notify team that your changes or ticket is ready for QA so it can be merged into `stg`
- Once changes are in `stg` send to QA for verification of feature
- If everything is okay, you can start working on a another feature starting from `dev`

Git workflow

```

                     +----------------+
              +------> featurebranch-1 +-----------+ (pull request)
              |      +----------------+            |
              |                                    |
  +--------+  |                                    +---------+
  |   dev  + -                                     |   dev   |
  +----+---+  |                                    +---------+
              |                                    |
              |      +-----------------+           |
              +------> featurebranch-2 +-----------+  (pull request)
                    +------------------+
```

# Deployment

> Deployments are handled by AWS code-pipeline

If you are working on a feature that introduces new environmental variables, these will have to be added to code-pipeline before tickets are merged in.

CI workflow

```
  Development           Staging                Production
  +--------+           +--------+             +---------+
  |   dev  | ------->  |   stg  |  ------->   |   main  |
  +--------+           +--------+             +---------+
```
