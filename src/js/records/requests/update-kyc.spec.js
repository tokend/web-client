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

    expect(record.destinationAccount)
      .to
      .equal(updateKycJSON.details.change_role.destination_account)

    expect(record.destinationAccount)
      .to
      .not
      .equal(undefined)

    expect(record.accountRoleToSet)
      .to
      .equal(updateKycJSON.details.change_role.account_role_to_set.int)

    expect(record.accountRoleToSet)
      .to
      .not
      .equal(undefined)

    expect(record.accountRoleToSetStr)
      .to
      .equal(updateKycJSON.details.change_role.account_role_to_set.string)

    expect(record.accountRoleToSetStr)
      .to
      .not
      .equal(undefined)

    expect(record.kycLevel)
      .to
      .equal(updateKycJSON.details.change_role.kyc_level)

    expect(record.kycLevel)
      .to
      .not
      .equal(undefined)

    expect(record.blobId)
      .to
      .equal(updateKycJSON.details.change_role.creator_details.blob_id)

    expect(record.blobId)
      .to
      .not
      .equal(undefined)

    expect(record.allTasks)
      .to
      .equal(updateKycJSON.details.change_role.all_tasks)

    expect(record.allTasks)
      .to
      .not
      .equal(undefined)

    expect(record.pendingTasks)
      .to
      .equal(updateKycJSON.details.change_role.pending_tasks)

    expect(record.pendingTasks)
      .to
      .not
      .equal(undefined)

    expect(record.sequenceNumber)
      .to
      .equal(updateKycJSON.details.change_role.sequence_number)

    expect(record.sequenceNumber)
      .to
      .not
      .equal(undefined)
  })

  it('externalDetails.rejector field', () => {
    const record = getRecord()

    expect(record.rejector)
      .to
      .equal(updateKycJSON.details.change_role.external_details[1].rejector)

    expect(record.rejector)
      .to
      .not
      .equal(undefined)
  })
})
