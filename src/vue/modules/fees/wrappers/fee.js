import _get from 'lodash/get'

import { FEE_SCOPES } from './../const/fee-scopes'

export class Fee {
  constructor (record) {
    this.fixed = record.fixed
    this.percent = record.percent

    this.asset = _get(record, 'appliedTo.asset')

    this.type = _get(record, 'appliedTo.feeType')
    this.subtype = _get(record, 'appliedTo.subtype')

    this.lowerBound = _get(record, 'appliedTo.lowerBound')
    this.upperBound = _get(record, 'appliedTo.upperBound')

    this.accountId = _get(record, 'account.id')
    this.accountRoleId = _get(record, 'accountRole.id')

    this.scope = this._getScope()
  }

  _getScope () {
    if (this.accountId) {
      return FEE_SCOPES.account
    } else if (this.accountRoleId) {
      return FEE_SCOPES.accountRole
    } else {
      return FEE_SCOPES.general
    }
  }
}
