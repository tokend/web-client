export class Balance {
  constructor (record) {
    this.available = record.state.available
    this.assetCode = record.asset.id
  }
}
