import { MockWrapper } from '../../../test'
import { UpdateKycRequestRecord } from './update-kyc.record'

import updateKycJSON from '../../../test/mocks/update-kyc'

describe('UpdateKycRequestRecord', () => {
  const getRecord = (rawJSON = updateKycJSON) => {
    const sdkResponse = MockWrapper.makeHorizonData(rawJSON)
    return new UpdateKycRequestRecord(sdkResponse)
  }

  it('constructor should properly set all the basic fields', () => {
    const record = getRecord()

    expect(record.accountToUpdateKyc)
      .to
      .equal(updateKycJSON.details.update_kyc.account_to_update_kyc)

    expect(record.accountToUpdateKyc)
      .to
      .not
      .equal(undefined)

    expect(record.accountTypeToSet)
      .to
      .equal(updateKycJSON.details.update_kyc.account_type_to_set.int)

    expect(record.accountTypeToSet)
      .to
      .not
      .equal(undefined)

    expect(record.accountTypeToSetStr)
      .to
      .equal(updateKycJSON.details.update_kyc.account_type_to_set.string)

    expect(record.accountTypeToSetStr)
      .to
      .not
      .equal(undefined)

    expect(record.kycLevel)
      .to
      .equal(updateKycJSON.details.update_kyc.kyc_level)

    expect(record.kycLevel)
      .to
      .not
      .equal(undefined)

    expect(record.blobId)
      .to
      .equal(updateKycJSON.details.update_kyc.kyc_data.blob_id)

    expect(record.blobId)
      .to
      .not
      .equal(undefined)

    expect(record.allTasks)
      .to
      .equal(updateKycJSON.details.update_kyc.all_tasks)

    expect(record.allTasks)
      .to
      .not
      .equal(undefined)

    expect(record.pendingTasks)
      .to
      .equal(updateKycJSON.details.update_kyc.pending_tasks)

    expect(record.pendingTasks)
      .to
      .not
      .equal(undefined)

    expect(record.sequenceNumber)
      .to
      .equal(updateKycJSON.details.update_kyc.sequence_number)

    expect(record.sequenceNumber)
      .to
      .not
      .equal(undefined)
  })

  it('externalDetails.rejector field', () => {
    const record = getRecord()

    expect(record.rejector)
      .to
      .equal(updateKycJSON.details.update_kyc.external_details[1].rejector)

    expect(record.rejector)
      .to
      .not
      .equal(undefined)
  })
})
