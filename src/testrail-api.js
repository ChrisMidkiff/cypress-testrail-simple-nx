// @ts-check

const debug = require('debug')('cypress-testrail-simple-nx')
const got = require('got')
const FormData = require('form-data')
const fs = require('fs')
const { getAuthorization } = require('./get-config')

async function getTestRun(runId, testRailInfo) {
  const closeRunUrl = `${testRailInfo.host}/index.php?/api/v2/get_run/${runId}`
  debug('get run url: %s', closeRunUrl)
  const authorization = getAuthorization(testRailInfo)

  // @ts-ignore
  const json = await got(closeRunUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization,
    },
  }).json()

  debug('get test run %d response', runId)
  debug(json)
  return json
}

async function closeTestRun(runId, testRailInfo) {
  console.log(
    'closing the TestRail run %d for project %s',
    runId,
    testRailInfo.projectId,
  )
  const closeRunUrl = `${testRailInfo.host}/index.php?/api/v2/close_run/${runId}`
  debug('close run url: %s', closeRunUrl)
  const authorization = getAuthorization(testRailInfo)

  // @ts-ignore
  const json = await got(closeRunUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization,
    },
    json: {
      name: 'Started run',
      description: 'Checking...',
    },
  }).json()

  debug('close test run response')
  debug(json)
  return json
}

async function getTestSuite(suiteId, testRailInfo) {
  const getSuiteUrl = `${testRailInfo.host}/index.php?/api/v2/get_cases/${testRailInfo.projectId}&suite_id=${suiteId}`
  debug('get suite url: %s', getSuiteUrl)
  const authorization = getAuthorization(testRailInfo)

  // @ts-ignore
  const json = await got(getSuiteUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization,
    },
  }).json()

  debug('get test suite %d response', suiteId)
  debug(json)
  return json
}

async function uploadAttachment(testRailInfo, resultId, path) {
  if (!fs.existsSync(path)) {
    console.log('file not found: %s', path)
    return
  }
  const uploadAttachmentUrl = `${testRailInfo.host}/index.php?/api/v2/add_attachment_to_result/${resultId}`
  debug('upload url: %s', uploadAttachmentUrl)
  const authorization = getAuthorization(testRailInfo)
  const form = new FormData()
  form.append('attachment', fs.createReadStream(path))

  // @ts-ignore
  await got(uploadAttachmentUrl, {
    method: 'POST',
    body: form,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
      authorization,
    },
  })
  debug('uploaded attachment to test result %d', resultId)

  return
}
async function getFailedTestsForRun(runId, testRailInfo) {
  const getTestsUrl = `${testRailInfo.host}/index.php?/api/v2/get_tests/${runId}&status_id=5`
  debug('get tests url: %s', getTestsUrl)
  const authorization = getAuthorization(testRailInfo)

  // @ts-ignore
  const json = await got(getTestsUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization,
    },
  }).json()

  debug('get test for run %d response', runId)
  debug(json)
  return json
}

module.exports = {
  getTestRun,
  closeTestRun,
  getTestSuite,
  getFailedTestsForRun,
  uploadAttachment,
}
