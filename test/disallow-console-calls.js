// Console methods (such as log, warn, and error) can be called
// through test execution without failing a test. Furthermore,
// if an unhandled exception was thrown, but all the test checks
// have passed, the test would not fail too. It may cause dirty test
// reports. Besides, ther is more dangerous issue: thrown unhandled
// error during test execution means that the test doesn't work
// as expected, though it can pass.

// That's the reason why there had been implemented a console
// watcher that counts all the console calls and fail tests if
// the console was called at least once through test execution.

let consoleCallCounter = 0

const errorFn = console.error
// eslint-disable-next-line no-console
const logFn = console.log
const warnFn = console.warn

console.error = (...args) => {
  consoleCallCounter++
  errorFn(...args)
}

// eslint-disable-next-line no-console
console.log = (...args) => {
  consoleCallCounter++
  logFn(...args)
}

console.warn = (...args) => {
  consoleCallCounter++
  warnFn(...args)
}

after(() => {
  if (consoleCallCounter) {
    throw new Error(
      `Console calls are dissalowed during test execution.
       Please, remove all of them and fix unhandled errors.
       Console calls found: ${consoleCallCounter}`
    )
  }
})
