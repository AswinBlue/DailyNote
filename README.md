# Events with Google Calendar API in React
## Installation
- set `package.json` and run `npm install react-scripts; npm install --legacy-peer-deps` to cmd
- set `src/index.css` with tailwind settings
- set `tailwind.config.js` file and `craco.config.js`
- `npm install;npm start`

## Deployment
 - install modules by `npm install -g gh-pages`
 - set YOUR_REPOSITORY_URL as a git remote url
 - make sure in "https://github.com/YOUR_GITHUB_ID/YOUR_REPOSITORY_URL/settings/pages, all settings are feasible
 - open `package.json` file and add below. YOUR_GITHUB_ID is your github ID
   - "homepage" : "http://YOUR_GITHUB_ID.github.io/YOUR_REPOSITORY_URL"
   - "scripts": {"predeploy": "npm run build", "deploy": "gh-pages -d build"}
 - run command `npm run deploy`

## Using the API
* Add your own Client Id and Api Key to App.js

## dev logs
https://hyper-pajama-66e.notion.site/DailyNote-261023634b3c46f4898e1da9f31b7fe0