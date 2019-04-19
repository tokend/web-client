// load all specs and test assets into one bundle
const disallowConsoleCalls = require.context('.', true, /disallow-console-calls\.js$/)
disallowConsoleCalls.keys().forEach(disallowConsoleCalls)

const testsContext = require.context('../src', true, /(\.spec\.js|\.e2e\.js)$/)
testsContext.keys().forEach(testsContext)
