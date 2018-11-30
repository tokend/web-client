import { errors } from '@tokend/js-sdk'

const Bus = {
  error: sinon.spy()
}

const globalize = sinon.spy()

/* eslint-disable-next-line import/no-webpack-loader-syntax */
const webpackInjector = require('inject-loader!babel-loader!./error-handler.js')
const { ErrorHandler } = webpackInjector({
  '@/vue/filters/globalize': { globalize },
  '@/js/helpers/event-bus': { Bus }
})

describe('error-handler unit test', () => {
  it('processUnexpected() emits Bus.error event', () => {
    const error = new Error('some error')

    ErrorHandler.processUnexpected(error)

    expect(Bus.error.calledOnce).to.be.true
  })

  describe('processUnexpected calls globalize() with proper translation id for sdk errors', () => {
    const expectedTranslations = {
      NetworkError: 'errors.network',
      TimeoutError: 'errors.timeout',
      InternalServerError: 'errors.internal',
      BadRequestError: 'errors.bad-request',
      NotAllowedError: 'errors.not-allowed',
      ForbiddenRequestError: 'errors.forbidden',
      TFARequiredError: 'errors.tfa-required',
      VerificationRequiredError: 'errors.verification-required',
      NotFoundError: 'errors.not-found',
      ConflictError: 'errors.conflict',
      UnauthorizedError: 'errors.unauthorized'
    }

    for (const [error, translationId] of Object.entries(expectedTranslations)) {
      it(`${error}-${translationId}`, () => {
        const mockResponse = {
          response: {
            data: {
              errors: [{
                title: 'Some error',
                detail: 'foo',
                meta: 'bar'
              }]
            }
          }
        }

        ErrorHandler.processUnexpected(new errors[error](mockResponse))

        expect(globalize.withArgs(translationId).calledOnce).to.be.true
      })
    }
  })
})
