import safeGet from 'lodash/get'

export class Balance {
  constructor (record) {
    this.id = record.id
    this.assetCode = safeGet(record, 'asset.id')
    this.amount = safeGet(record, 'state.available')
  }
}
