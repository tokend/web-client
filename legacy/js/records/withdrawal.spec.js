import { WithdrawalRecord } from './withdrawal.record'
import { recordResponses } from './test/records.mocks'

describe('record.withdraw', () => {
  let withdrawalRecord
  beforeEach (() => {
    withdrawalRecord = new WithdrawalRecord(recordResponses.withdraw)
  })

  it('should properly parse amount field', () => {
    expect(withdrawalRecord.amount).to.equal(recordResponses.withdraw.amount)
  })
  it('should properly parse fixedFee field', () => {
    expect(withdrawalRecord.fixedFee).to.equal(recordResponses.withdraw.fee_fixed)
  })
  it('should properly parse percentFee field', () => {
    expect(withdrawalRecord.percentFee).to.equal(recordResponses.withdraw.fee_percent)
  })
  it('should properly parse counterparty field', () => {
    expect(withdrawalRecord.counterparty).to.equal(recordResponses.withdraw.external_details.address)
  })
  it('should properly parse direction field', () => {
    expect(withdrawalRecord.direction).to.equal('out')
  })
  it('should properly parse destinationAsset field', () => {
    expect(withdrawalRecord.destinationAsset).to.equal(recordResponses.withdraw.dest_asset)
  })
  it('should properly parse destinationAmount field', () => {
    expect(withdrawalRecord.destinationAmount).to.equal(recordResponses.withdraw.dest_amount)
  })
})
