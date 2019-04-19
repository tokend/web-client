import { errors } from '@/js/errors'
import { Bus } from '@/js/helpers/event-bus'
import log from 'loglevel'
import i18next from 'i18next'

export class ErrorHandler {
  static process (error, translationId = '') {
    ErrorHandler.processWithoutFeedback(error)
    Bus.error(translationId || ErrorHandler._getTranslationId(error))
  }

  static processWithoutFeedback (error) {
    log.error(error)
  }

  static _getTranslationId (error) {
    let translationId

    switch (error.constructor) {
      case errors.NetworkError:
        translationId = 'errors.network'
        break
      case errors.UserDoesntExistError:
        translationId = 'errors.user-doesnt-exist'
        break
      case errors.BalanceNotFoundError:
        translationId = 'errors.balance-not-found'
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
      case errors.UserExistsError:
        translationId = 'errors.user-exists'
        break
      case errors.TransactionError:
        translationId = `transaction-errors.${error.errorResults[0].errorCode}`
        if (!i18next.exists(translationId)) {
          // If there is no localized error code, display the message
          // that came from the backend
          translationId = error.errorResults[0].message
        }
        break
      default:
        translationId = 'errors.default'
    }

    return translationId
  }
}
