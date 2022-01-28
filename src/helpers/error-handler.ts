import log from 'loglevel'
import { Bus } from '@/helpers/event-bus'

type ErrorType = Error | string | symbol

export class ErrorHandler {
  static process (error: ErrorType, translationId = ''): void {
    const msgTrId = translationId || ErrorHandler._getTranslationId(error)
    Bus.error(msgTrId)

    ErrorHandler.processWithoutFeedback(error)
  }

  static processWithoutFeedback (error: ErrorType): void {
    log.error(error)
  }

  static _getTranslationId (error: ErrorType): string {
    let translationId: string

    switch (error.constructor) {
    default: {
      translationId = 'errors.default'
    }
    }

    return translationId
  }
}
