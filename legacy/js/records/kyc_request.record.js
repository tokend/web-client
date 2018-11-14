import get from 'lodash/get'

export class KycRequestRecord {
  constructor (record) {
    this.id = record.id
    this.requestor = record.requestor
    this.reviewer = record.reviewer
    this.reference = record.reference
    this.rejectReason = record.reject_reason
    this.hash = record.hash
    this.requestTypeI = get(record, 'details.request_type_i')
    this.requestType = get(record, 'details.request_type')
    this.twoStepWithdrawal = get(record, 'details.two_step_withdrawal')
    this.limitsUpdate = get(record, 'details.limits_update')
    this.amlAlert = get(record, 'details.aml_alert')
    this.accountToUpdateKyc =
      get(record, 'details.update_kyc.account_to_update_kyc')
    this.accountTypeToSetI =
      get(record, 'details.update_kyc.account_type_to_set.int')
    this.accountTypeToSet =
      get(record, 'details.update_kyc.account_type_to_set.string')
    this.kycLevel = get(record, 'details.update_kyc.kyc_level')
    this.blobId = get(record, 'details.update_kyc.kyc_data.blob_id')
    this.allTasks = get(record, 'details.update_kyc.all_tasks')
    this.pendingTasks = get(record, 'details.update_kyc.pending_tasks')
    this.sequenceNumber = get(record, 'details.sequence_number')
    this.externalDetails = get(record, 'details.external_details')
    this.createdAt = record.created_at
    this.updatedAt = record.updated_at
    this.stateI = record.request_state_i
    this.state = record.request_state
  }
}
