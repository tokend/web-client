import { errors } from '@/js/errors'
import { Bus } from '@/js/helpers/event-bus'
import { TestHelper } from '@/test/test-helper'
import log from 'loglevel'
import i18next from 'i18next'
import { ErrorHandler } from '@/js/helpers/error-handler'

describe('error-handler helper', () => {
  let sandbox
  beforeEach(() => (sandbox = sinon.createSandbox()))
  afterEach(() => sandbox.restore())

  describe('using process()', () => {
    it('processes the error and shows a feedback to the user', () => {
      const theError = new Error()
      const feedbackTranslationId = 'some-error.translation-id'
      const sentryReportConfig = {
        sentryReportTitle: '',
        skipSentryReport: false,
      }
      sandbox.stub(ErrorHandler, 'processWithoutFeedback')
      sandbox.stub(ErrorHandler, '_getTranslationId')
        .withArgs(theError)
        .returns(feedbackTranslationId)
      sandbox.stub(Bus, 'error')

      ErrorHandler.process(theError, '', sentryReportConfig)

      expect(ErrorHandler.processWithoutFeedback)
        .to.have.been.calledOnceWithExactly(theError, sentryReportConfig)
      expect(ErrorHandler._getTranslationId)
        .to.have.been.calledOnceWithExactly(theError)
      expect(Bus.error)
        .to.have.been.calledOnceWithExactly(feedbackTranslationId)
    })
  })

  describe('using processWithoutFeedback()', () => {
    it('captures Sentry message', () => {
      const theError = new Error()
      const sentryReportConfig = {
        sentryReportTitle: '',
        skipSentryReport: false,
      }
      sandbox.stub(ErrorHandler, 'captureSentryMessage')
      sandbox.stub(log, 'error')
      ErrorHandler.processWithoutFeedback(theError, sentryReportConfig)

      expect(ErrorHandler.captureSentryMessage)
        .to.have.been.calledOnceWithExactly(theError, sentryReportConfig)
    })

    it('logs the error', () => {
      const theError = new Error()
      const sentryReportConfig = {
        sentryReportTitle: '',
        skipSentryReport: false,
      }
      sandbox.stub(ErrorHandler, 'captureSentryMessage')
      sandbox.stub(log, 'error')
      ErrorHandler.processWithoutFeedback(theError, sentryReportConfig)

      expect(log.error)
        .to.have.been.calledOnceWithExactly(theError)
    })
  })

  describe('using captureSentryMessage()', () => {
    it('it capture message if skipSentryReport is false', () => {
      const theError = new Error()
      const sentryReportConfig = {
        sentryReportTitle: '',
        skipSentryReport: false,
      }
      const feedbackTranslationId = 'some-error.translation-id'
      sandbox.stub(i18next, 'getFixedT')
        .withArgs('en')
        .returns(() => {
          return 'some-error.translation-id'
        })
      sandbox.stub(ErrorHandler, '_getTranslationId')
        .withArgs(theError)
        .returns(feedbackTranslationId)

      sandbox.stub(ErrorHandler, '_captureSentryReport')
      ErrorHandler.captureSentryMessage(theError, sentryReportConfig)
      expect(ErrorHandler._captureSentryReport).to.have.been.calledOnce
    })
  })

  describe('using _getTranslationId()', () => {
    describe('transforms the given', () => {
      const testCases = [
        {
          in: TestHelper.getError(errors.NetworkError),
          expectedOut: 'errors.network',
        },
        {
          in: TestHelper.getError(errors.TimeoutError),
          expectedOut: 'errors.timeout',
        },
        {
          in: TestHelper.getError(errors.InternalServerError),
          expectedOut: 'errors.internal',
        },
        {
          in: TestHelper.getError(errors.BadRequestError),
          expectedOut: 'errors.bad-request',
        },
        {
          in: TestHelper.getError(errors.NotAllowedError),
          expectedOut: 'errors.not-allowed',
        },
        {
          in: TestHelper.getError(errors.ForbiddenRequestError),
          expectedOut: 'errors.forbidden',
        },
        {
          in: TestHelper.getError(errors.TFARequiredError),
          expectedOut: 'errors.tfa-required',
        },
        {
          in: TestHelper.getError(errors.VerificationRequiredError),
          expectedOut: 'errors.verification-required',
        },
        {
          in: TestHelper.getError(errors.NotFoundError),
          expectedOut: 'errors.not-found',
        },
        {
          in: TestHelper.getError(errors.ConflictError),
          expectedOut: 'errors.conflict',
        },
        {
          in: TestHelper.getError(errors.UnauthorizedError),
          expectedOut: 'errors.unauthorized',
        },
        {
          in: TestHelper.getError(errors.UserExistsError),
          expectedOut: 'errors.user-exists',
        },
        {
          in: new Error(),
          expectedOut: 'errors.default',
        },
        {
          in: 'anything',
          expectedOut: 'errors.default',
        },
      ]

      for (const testCase of testCases) {
        it(` into "${testCase.expectedOut}"`, () => {
          const result = ErrorHandler._getTranslationId(testCase.in)

          expect(result).to.equal(testCase.expectedOut)
        })
      }
    })
  })
})
