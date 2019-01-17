import { errors } from '@tokend/js-sdk'
import { Bus } from '@/js/helpers/event-bus'
import { TestHelper } from '@/test/test-helper'

import { ErrorHandler } from '@/js/helpers/error-handler'

describe('error-handler unit test', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('process calls Bus.error() with proper translation id for sdk errors', () => {
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
      UnauthorizedError: 'errors.unauthorized',
    }

    for (const [error, translationId] of Object.entries(expectedTranslations)) {
      it(`${error}-${translationId}`, () => {
        const spy = sinon.stub(Bus, 'error')

        ErrorHandler.process((TestHelper.getError(errors[error])))

        expect(spy.withArgs(translationId).calledOnce)
          .to
          .be
          .true
      })
    }
  })
})
