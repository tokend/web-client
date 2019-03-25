let errorSpy

beforeEach(() => {
  errorSpy = sinon.stub(console, 'error')
})

afterEach(() => {
  if (errorSpy.called) throw new Error(errorSpy.args[0])
  try {
    errorSpy.restore()
  } catch {}
})
