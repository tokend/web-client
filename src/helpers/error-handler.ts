import log from 'loglevel'
import { Bus } from '@/helpers/event-bus'

export class ErrorHandler {
  static process(error: Error, translationId = ''): void {
    const msgTrId = translationId || ErrorHandler._getTranslationId(error)
    Bus.error(msgTrId)

    ErrorHandler.processWithoutFeedback(error)
  }

  static processWithoutFeedback(error: Error): void {
    log.error(error)
  }

  static _getTranslationId(error: Error): string {
    let translationId: string

    switch (error.constructor) {
      default: {
        translationId = 'errors.default'
      }
    }

    return translationId
  }
}
