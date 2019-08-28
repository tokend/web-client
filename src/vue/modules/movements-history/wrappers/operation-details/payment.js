/**
 * Payment is an operation that charges costs from one account and sales with
 * them another account
 */
export class PaymentOp {
  constructor (record) {
    this.sourceFixedFee = record.sourceFee.fixed
    this.sourceCalculatedPercentFee = record.sourceFee.calculatedPercent
    this.destinationFixedFee = record.destinationFee.fixed
    this.destinationCalculatedPercentFee = record.destinationFee
      .calculatedPercent
    this.sourcePayForDestination = record.sourcePayForDestination
    this.subject = this._getSubject(record)
    this.reference = record.reference

    this.fromAccountId = this._getFromAccountId(record)
    this.toAccountId = this._getToAccountId(record)
    this.fromBalanceId = record.balanceFrom.id
    this.toBalanceId = record.balanceTo.id
    this.assetCode = record.asset.id
  }

  isIncoming (accountId) {
    return this.fromAccountId !== accountId
  }

  _getSubject (record) {
    try {
      return JSON.parse(record.subject).subject
    } catch (e) {
      return record.subject
    }
  }
  _getFromAccountId (record) {
    try {
      let sender = JSON.parse(record.subject).sender
      if (sender) {
        return sender
      } else {
        return record.accountFrom.id
      }
    } catch (e) {
      return record.accountFrom.id
    }
  }

  _getToAccountId (record) {
    try {
      let toAccountEmail = JSON.parse(record.subject).email
      if (toAccountEmail) {
        return toAccountEmail
      } else {
        return record.accountTo.id
      }
    } catch (e) {
      return record.accountTo.id
    }
  }
}
