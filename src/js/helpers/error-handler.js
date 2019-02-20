import { errors } from '@/js/errors'
import { Bus } from '@/js/helpers/event-bus'
import log from 'loglevel'

import { OPERATION_ERROR_CODES } from '@/js/const/operation-error-codes'

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
        if (error.includesOpCode(OPERATION_ERROR_CODES.opAccountBlocked)) {
          translationId = 'errors.account-blocked'
        } else {
          translationId = 'errors.transaction'
        }
        break
      default:
        translationId = 'errors.default'
    }

    return translationId
  }
}
