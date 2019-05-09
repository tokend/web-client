import { errors } from '@/js/errors'
import { Bus } from '@/js/helpers/event-bus'
import { TestHelper } from '@/test/test-helper'
import log from 'loglevel'
import i18next from 'i18next'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { ErrorTracker } from '@/js/helpers/error-tracker'

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
    it('tracks message', () => {
      const theError = new Error()
      const errorTrackerConfig = {
        errorTrackMsg: '',
        skipErrorTracking: false,
      }
      sandbox.stub(ErrorHandler, 'trackMessage')
      sandbox.stub(log, 'error')
      ErrorHandler.processWithoutFeedback(theError, errorTrackerConfig)

      expect(ErrorHandler.trackMessage)
        .to.have.been.calledOnceWithExactly(theError, errorTrackerConfig)
    })

    it('logs the error', () => {
      const theError = new Error()
      const errorTrackerConfig = {
        errorTrackMsg: '',
        skipErrorTracking: false,
      }
      sandbox.stub(ErrorHandler, 'trackMessage')
      sandbox.stub(log, 'error')
      ErrorHandler.processWithoutFeedback(theError, errorTrackerConfig)

      expect(log.error)
        .to.have.been.calledOnceWithExactly(theError)
    })
  })

  describe('using trackMessage()', () => {
    it('it tracks message with default params', () => {
      const theError = new Error()
      const englifyStub = sinon.fake.returns('some message')
      sandbox.stub(i18next, 'getFixedT')
        .withArgs('en')
        .returns(englifyStub)
      sandbox.stub(ErrorHandler, '_getTranslationId')
        .withArgs(theError)
        .returns('some-error.translation-id')
      sandbox.stub(ErrorTracker, 'trackMessage')
      ErrorHandler.trackMessage(theError)
      expect(ErrorTracker.trackMessage).to.have.been.calledOnceWithExactly(
        englifyStub('some-error.translation-id')
      )
    })

    it('it tracks message with custom params', () => {
      const theError = new Error()
      const errorTrackerConfig = {
        message: 'some-error.translation-id',
        skipTrack: false,
      }
      const englifyStub = sinon.fake.returns('some message')
      sandbox.stub(i18next, 'getFixedT')
        .withArgs('en')
        .returns(englifyStub)

      sandbox.stub(ErrorTracker, 'trackMessage')
      ErrorHandler.trackMessage(theError, errorTrackerConfig)
      expect(ErrorTracker.trackMessage).to.have.been.calledOnceWithExactly(
        englifyStub('some-error.translation-id')
      )
    })
    it('it doesn`t track message if skipTrack = true', () => {
      const theError = new Error()
      const errorTrackerConfig = {
        message: '',
        skipTrack: true,
      }
      sandbox.stub(ErrorTracker, 'trackMessage')
      ErrorHandler.trackMessage(theError, errorTrackerConfig)
      expect(ErrorTracker.trackMessage).not.to.have.been.called
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
