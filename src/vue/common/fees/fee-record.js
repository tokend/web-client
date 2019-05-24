export class FeeRecord {
  constructor ({ fixed = '', calculatedPercent = '', assetCode, type }) {
    this.fixed = fixed
    this.calculatedPercent = calculatedPercent
    this.assetCode = assetCode
    this.type = type
  }
}
