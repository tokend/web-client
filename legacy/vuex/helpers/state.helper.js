import store from '../index'
import { REQUEST_STATES_STR } from '../../js/const/request_states.const'
import { accountsService } from '../../js/services/accounts.service'
import { RecordFactory } from '../../js/records/factory'
import { vuexTypes } from '../types'
import get from 'lodash/get'

export class StateHelper {
  /**
   * Groups balances by asset code
   * @param {array} balances
   * @returns {object} groupedBalances
   */
  static groupBalances (balances) {
    return balances.reduce((groupedBalances, balance) => {
      groupedBalances[balance.asset] = balance
      return groupedBalances
    }, {})
  }

  /**
   * Gives you balance id by token code, if exitsts, otherwise - creates new
   *
   * @async
   * @param code
   * @return {string} balanceId
   */
  static async getBalanceId (code) {
    const balance = store.getters.balances[code]
    const balanceId = get(balance, 'balance_id')
    if (balanceId) return balanceId

    await accountsService.createBalance(code)
    await Promise.all([
      store.dispatch(vuexTypes.GET_ACCOUNT_DETAILS),
      store.dispatch(vuexTypes.GET_BALANCES)
    ])
    return store.getters.balances[code].balance_id
  }

  static getSaleIdWhereUSerParticipated () {
    return store.getters.rawBalances
      .map(balance => get(balance, 'asset_details.sales[0].id'))
      .filter(id => id)
  }

  static deriveTokensFromBalancesDetails (filter = () => true) {
    return store.getters.accountRawBalances
      .map(balance => RecordFactory.createTokenRecord(
        get(balance, 'asset_details'), {
          balance: balance.balance,
          balanceLocked: balance.locked,
          convertedBalance: balance.converted_balance,
          convertedBalanceLocked: balance.converted_locked
        }
      ))
      .filter(filter)
  }

  static defineLatestKycRequest (state) {
    const requests = state.kycRequests
    return requests.find(request =>
      request.state === REQUEST_STATES_STR.pending
    ) ||
    requests.find(request =>
      request.state === REQUEST_STATES_STR.rejected
    ) ||
    requests.find(request =>
      request.state === REQUEST_STATES_STR.approved
    ) || {}
  }
}
