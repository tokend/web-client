import _get from 'lodash/get'

export class AccountHelper {
  static groupExternalSystemAccounts (externalSystemAccounts = []) {
    return externalSystemAccounts
      .reduce((accounts, account) => {
        accounts[_get(account, 'type.value')] = account.data // type:address
        return accounts
      }, {})
  }

  static groupBalancesByAsset (balances = []) {
    return balances
      .reduce((balances, balance) => {
        balances[balance.asset] = balance
      }, {})
  }
}
