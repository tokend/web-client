export class Balance {
  constructor (record) {
    this.id = record.id
    this.assetCode = record.asset.id
    this.value = record.state.available
  }
}
