import { globalize } from '@/vue/filters/globalize'
import { errors } from '@tokend/js-sdk'
import { Bus } from '@/js/helpers/event-bus'

export class ErrorHandler {
  static processUnexpected (error) {
    let translationId

    switch (error.constructor) {
      case errors.NetworkError:
        translationId = 'errors.network'
        break
      case errors.TimeoutError:
        translationId = 'errors.timeout'
        break
      case errors.InternalServerError:
        translationId = 'errors.internal'
        break
      case errors.BadRequestError:
        translationId = 'errors.bad-request'
        break
      case errors.NotAllowedError:
        translationId = 'errors.not-allowed'
        break
      case errors.ForbiddenRequestError:
        translationId = 'errors.forbidden'
        break
      case errors.TFARequiredError:
        translationId = 'errors.tfa-required'
        break
      case errors.VerificationRequiredError:
        translationId = 'errors.verification-required'
        break
      case errors.NotFoundError:
        translationId = 'errors.not-found'
        break
      case errors.ConflictError:
        translationId = 'errors.conflict'
        break
      case errors.UnauthorizedError:
        translationId = 'errors.unauthorized'
        break
      default:
        translationId = 'errors.default'
    }

    Bus.error(globalize(translationId))
  }
}
