# cypress-testrail-simple-nx

> Simple upload of Cypress test results to TestRail when using NX

## Install

Add this plugin as a dev dependency

```
# If using NPM
$ npm i -D cypress-testrail-simple-nx
# If using Yarn
$ yarn add -D cypress-testrail-simple-nx
```

Add the plugin to your Cypress plugin file

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  // https://github.com/benhamiltonpro/cypress-testrail-simple-nx
  require('cypress-testrail-simple-nx/src/plugin')(on)
}
```

## Environment variables

When running the Cypress tests on CI, you need to provide the TestRail server variables through the environment variables. The following variables should be set:

```
TESTRAIL_HOST=
TESTRAIL_USERNAME=
; the user password or API key for the user
; API key is preferred
TESTRAIL_PASSWORD=
; Note: the project ID is not very sensitive value
TESTRAIL_PROJECTID=
; if you use suites, add a suite ID (with S or without)
TESTRAIL_SUITEID=...
```

If these variables are present, we assume the user wants to use the plugin. You can disable the plugin by passing an argument

```js
module.exports = (on, config) => {
  // skip loading the plugin
  require('cypress-testrail-simple-nx/src/plugin')(on, true)
}
```

## Bin commands

### testrail-start-run

To start a new TestRail run

```
runId=$(npx testrail-start-run)
```

You can pass an optional test run name and description

```
runId=$(npx testrail-start-run "test run" "test run description")
```

You can redirect the run ID into a file

```
npx testrail-start-run > runId.txt
```

#### Arguments

- `--name` optional name for the test run, alias `-n`
- `--description` optional description for the test run, alias `-d`
- `--suite` optional suite ID, alias `-s`
- `--spec` optional [globby](https://github.com/sindresorhus/globby#readme) pattern for finding specs, extracting case IDs (using the `C\d+` regular expression), and starting a new TestRail run with those case IDs only. Alias `-s`. This option is very useful if only some test cases are automated using Cypress. See the workflow examples in [.github/workflows/cases.yml](./.github/workflows/cases.yml) and [.circleci/config.yml](./.circleci/config.yml).

```
npx testrail-start-run --name "test run" --description "test run description"
# prints the run id
```

For readability, you can split the command across multiple lines usually

```
npx testrail-start-run \
  --name "test run" \
  --description "test run description" \
  --spec "cypress/integration/featureA/**.js"
```

### testrail-close-run

To close an open test run, pass the run ID as an argument or in the file `./runId.txt`

```
# read the run ID from the command line argument
npx testrail-close-run 60
# read the run ID from the file runId.txt
npx testrail-close-run
```
### testrail-report-run

To report on a test run, pass the run ID as an argument or in the file `./runId.txt`

Reports as a json string using stdout for parsing

```
# read the run ID from the command line argument
npx testrail-report-run 60
# read the run ID from the file runId.txt
npx testrail-report-run
```

## Sending test results

During `cypress run` the plugin can send test results for each test case found in the test title using `C\d+` regular expression. To send the results, you need to set the run ID as an environment variable `TESTRAIL_RUN_ID` or by having it in the file `runId.txt`

## Debugging

This tool uses [debug](https://github.com/visionmedia/debug#readme) to output verbose logs. To see the logs, run it with environment variable `DEBUG=cypress-testrail-simple-nx`.

To start a new test rail run locally and see how the new run is created

```
$ as-a . node ./bin/testrail-start-run.js --spec 'cypress/integration/*.js'
```

## Why?

Because [cypress-testrail-reporter](https://github.com/Vivify-Ideas/cypress-testrail-reporter) is broken in a variety of ways and does not let me open issues to report the problems.

## Small print

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/benhamiltonpro/cypress-testrail-simple-nx/issues) on Github

## MIT License

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
