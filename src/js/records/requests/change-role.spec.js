import { MockWrapper } from '../../../test'
import { ChangeRoleRequestRecord } from './change-role.record'

import updateKycJSON from '../../../test/mocks/update-kyc'

describe('UpdateKycRequestRecord', () => {
  const getRecord = (rawJSON = updateKycJSON) => {
    const apiResponse = MockWrapper.makeJsonapiResponseData(rawJSON)
    return new ChangeRoleRequestRecord(apiResponse[0])
  }

  it('constructor should properly set all the basic fields', () => {
    const record = getRecord()

    expect(record.accountToUpdateRole)
      .to
      .equal(updateKycJSON.included[0].relationships
        .account_to_update_role.data.id
      )

    expect(record.accountToUpdateRole)
      .to
      .not
      .equal(undefined)

    expect(record.accountRoleToSet)
      .to
      .equal(updateKycJSON.included[0].attributes.account_role_to_set)

    expect(record.accountRoleToSet)
      .to
      .not
      .equal(undefined)

    expect(record.blobId)
      .to
      .equal(updateKycJSON.included[0].attributes.kyc_data.blob_id)

    expect(record.blobId)
      .to
      .not
      .equal(undefined)
  })

  it('externalDetails.rejector field', () => {
    const record = getRecord()

    expect(record.rejector)
      .to
      .equal(updateKycJSON.data[0].attributes.external_details.data[0].rejector)

    expect(record.rejector)
      .to
      .not
      .equal(undefined)
  })
})
