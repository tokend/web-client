let consoleErrors = []

console.error = e => {
  consoleErrors.push(e)
}

console.log = message => {
  consoleErrors.push(
    new Error(`console.log is forbidden during test execution. Message: ${message}`)
  )
}

console.warn = message => {
  consoleErrors.push(
    new Error(`console.warn is forbidden during test execution. Message: ${message}`)
  )
}

afterEach(() => {
  if (consoleErrors.length) {
    throw consoleErrors[0]
  }
})
