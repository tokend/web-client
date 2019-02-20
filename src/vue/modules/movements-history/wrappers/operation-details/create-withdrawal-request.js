/**
 * Create withdraw request operation moves the funds to the locked state until
 * the request is either approved or rejected
 */
export class CreateWithdrawRequestOp {
  constructor (record) {
    this.externalDetails = record.externalDetails
  }
}
