import _get from 'lodash/get'
import { store, vuexTypes } from '@/vuex/index'

const STATUSES = Object.freeze({
  notRegistered: 'not_registered',
  active: 'active',
  blocked: 'blocked',
})

export class CustomerRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.email = _get(record, 'email')
    this.accountId = _get(record, 'accountId')
    this.status = _get(record, 'status')
    this.firstName = _get(record, 'firstName')
    this.lastName = _get(record, 'lastName')
    this.status = _get(record, 'status')
    this.balances = _get(record, 'balances', [])
      .map(item => ({
        id: item.id,
        assetCode: item.asset,
        amount: item.amount,
      }))
  }

  get isNotRegistered () {
    return this.status === STATUSES.notRegistered
  }

  get isActive () {
    return this.status === STATUSES.active
  }

  get isCustomer () {
    const currentAccountId = store.getters[vuexTypes.accountId]
    return this.accountId === currentAccountId
  }

  get isBlocked () {
    return this.status === STATUSES.blocked
  }

  static get statuses () {
    return STATUSES
  }
}
