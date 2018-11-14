import { Service } from './service'
import config from '../../../src/config'

export class TransactionsService extends Service {
  /**
   * Loads tx_history for provided token
   * @param tokenCode
   *
   * @return {Promise<object>} - Promise object representing tx history
   */
  loadTransactionHistory (tokenCode) {
    return this._horizonRequestBuilder
      .payments()
      .forAccount(this._accountId)
      .forAsset(tokenCode)
      .order('desc')
      .limit(config.TRANSACTIONS_PER_PAGE)
      .callWithSignature(this._keypair)
  }
}

export const transactionsService = new TransactionsService()
