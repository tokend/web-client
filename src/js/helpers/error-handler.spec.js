import { errors } from '@tokend/js-sdk'
import { Bus } from '@/js/helpers/event-bus'
import * as globalizeModule from '@/vue/filters/globalize'
import { TestHelper } from '@/test/test-helper'

import { ErrorHandler } from '@/js/helpers/error-handler'

describe('error-handler unit test', () => {
  beforeEach(() => {
    sinon.restore()
  })

  it('process() emits Bus.error event', () => {
    const error = new Error('some error')
    const spy = sinon.stub(Bus, 'error')

    ErrorHandler.process(error)

    expect(spy.calledOnce).to.be.true
  })

  describe('process calls globalize() with proper translation id for sdk errors', () => {
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
        const spy = sinon.stub(globalizeModule, 'globalize')

        ErrorHandler.process((TestHelper.getError(errors[error])))

        expect(spy.withArgs(translationId).calledOnce)
          .to
          .be
          .true
      })
    }
  })
})
