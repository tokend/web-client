export class BalanceRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.state = record.state
    this.locked = record.state.locked
    this.available = record.state.available
    this.assetCode = record.asset.id
  }
}
