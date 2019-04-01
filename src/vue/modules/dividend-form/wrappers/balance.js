export class Balance {
  constructor (record) {
    this.id = record.id
    this.asset = record.asset.id
    this.available = record.state.available
    this.locked = record.state.locked
  }
}
