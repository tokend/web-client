export class Issuance {
  constructor ({ record, xdr, isUsed }) {
    this.asset = record.asset
    this.amount = record.amount
    this.xdr = xdr
    this.isUsed = isUsed
  }
}
