// load all specs into one bundle
const testsContext = require.context('./src', true, /(\.spec\.js|\.e2e\.js)$/)
testsContext.keys().forEach(testsContext)
