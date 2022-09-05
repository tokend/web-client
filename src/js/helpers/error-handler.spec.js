import { errors } from '@/js/errors'
import { Bus } from '@/js/helpers/event-bus'
import { TestHelper } from '@/test/test-helper'
import log from 'loglevel'
import { i18n } from '@/i18n'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { ErrorTracker } from '@/js/helpers/error-tracker'

describe('error-handler helper', () => {
  let sandbox
  beforeEach(() => (sandbox = sinon.createSandbox()))
  afterEach(() => sandbox.restore())

  describe('using process()', () => {
    it('processes the error and shows a feedback to the user', () => {
      const theError = new Error('Some error')
      sandbox.stub(ErrorHandler, 'processWithoutFeedback')
      sandbox.stub(ErrorHandler, '_getTranslationId')
        .withArgs(theError)
        .returns('some-error.translation-id')
      sandbox.stub(Bus, 'error')

      ErrorHandler.process(theError, '', { someParam: 42 })

      expect(ErrorHandler.processWithoutFeedback)
        .to.have.been.calledOnceWithExactly(theError, {
          someParam: 42,
          translationId: 'some-error.translation-id',
        })
      expect(Bus.error)
        .to.have.been.calledOnceWithExactly('some-error.translation-id')
    })
  })

  it('processes the error and rewrites the error tracker config message id', () => {
    const theError = new Error('Some error')
    sandbox.stub(ErrorHandler, 'processWithoutFeedback')
    sandbox.stub(ErrorHandler, '_getTranslationId')
      .withArgs(theError)
      .returns('some-error.translation-id')
    sandbox.stub(Bus, 'error')

    ErrorHandler.process(theError, 'custom-translation-id', { someParam: 42 })

    expect(ErrorHandler.processWithoutFeedback)
      .to.have.been.calledOnceWithExactly(theError, {
        someParam: 42,
        translationId: 'custom-translation-id',
      })
    expect(Bus.error)
      .to.have.been.calledOnceWithExactly('custom-translation-id')
  })

  describe('using processWithoutFeedback()', () => {
    it('tracks message', () => {
      const theError = new Error('Some error')
      sandbox.stub(ErrorHandler, 'trackMessage')
      sandbox.stub(log, 'error')

      ErrorHandler.processWithoutFeedback(theError, { someParam: 42 })

      expect(ErrorHandler.trackMessage, 'tracks the error')
        .to.have.been.calledOnceWithExactly(theError, { someParam: 42 })
      const err = JSON.stringify({ message: theError.message })
      expect(log.error, 'logs the error')
        .to.have.been.calledOnceWithExactly(err)
    })
  })

  describe('using trackMessage()', () => {
    it('it tracks message with default params', () => {
      const theError = new Error('Some error')
      const englifyStub = sinon.stub()
      sandbox.stub(ErrorHandler, '_getTranslationId')
        .withArgs(theError)
        .returns('some-error.translation-id')
      englifyStub
        .withArgs('some-error.translation-id')
        .returns('some message')
      sandbox.stub(i18n, 'getFixedT')
        .withArgs('en')
        .returns(englifyStub)
      sandbox.stub(ErrorTracker, 'trackMessage')

      ErrorHandler.trackMessage(theError)

      expect(ErrorTracker.trackMessage).to.have.been
        .calledOnceWithExactly('some message')
    })

    it('it tracks message with custom tranlslationId provided', () => {
      const englifyStub = sinon.stub()
      sandbox.stub(ErrorHandler, '_getTranslationId')
      englifyStub
        .withArgs('custom-translation-id')
        .returns('some message')
      sandbox.stub(i18n, 'getFixedT')
        .withArgs('en')
        .returns(englifyStub)
      sandbox.stub(ErrorTracker, 'trackMessage')

      ErrorHandler.trackMessage(
        new Error('Some message'),
        { translationId: 'custom-translation-id' },
      )

      expect(ErrorHandler._getTranslationId).to.have.not.been.called
      expect(ErrorTracker.trackMessage).to.have.been
        .calledOnceWithExactly('some message')
    })

    it('it does not track message if skipTrack = true', () => {
      sandbox.stub(ErrorHandler, '_getTranslationId')
      sandbox.stub(i18n, 'getFixedT').returns(sinon.spy())
      sandbox.stub(ErrorTracker, 'trackMessage')

      ErrorHandler.trackMessage(
        new Error('Some message'),
        { skipTrack: true },
      )

      expect(ErrorHandler._getTranslationId).to.have.not.been.called
      expect(i18n.getFixedT).to.have.not.been.called
      expect(ErrorTracker.trackMessage).to.have.not.been.called
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
