let thrownErrors = []

console.error = e => {
  thrownErrors.push(e)
}

afterEach(() => {
  if (thrownErrors.length) {
    throw thrownErrors[0]
  }
})
