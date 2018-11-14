import { CommonResponseBuilder } from './modules/common_response_builder'
import { TransactionResponseBuilder } from './modules/transaction_response_builder'

export class Response {
  static getCommonResponse () {
    return new CommonResponseBuilder(...arguments)
  }

  static getTransactionResponse () {
    return new TransactionResponseBuilder(...arguments)
  }
}

export default Response
