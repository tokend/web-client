/**
 * Create AML alert request - moves balance funds to the locked state until the
 * request is either approved or rejected.
 */
export class CreateAMLAlertRequestOp {
  constructor (record) {
    this.reason = record.reason
  }
}
