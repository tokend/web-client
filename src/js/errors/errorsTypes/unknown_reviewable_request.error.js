import { ExtendableError } from './extendable_error.error'

export class UnknownReviewableRequestError extends ExtendableError {
  constructor (request) {
    const typeI = request.details.request_type_i
    const typeStr = request.details.request_type
    super(`Unknown reviewable request: ${typeStr} (${typeI})`)
    this.typeI = typeI
    this.typeStr = typeStr
    this.errorType = 'UnknownReviewableRequestError'
  }
}
