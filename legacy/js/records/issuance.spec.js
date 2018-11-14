import { IssuanceRecord } from './issuance.record'
import { recordResponses, mockAccountId, mockCounterpartyId } from './test/records.mocks'

describe('record.issuance', () => {
  let issuanceRecord
  beforeEach(() => {
    issuanceRecord = new IssuanceRecord(recordResponses.issuance, mockAccountId)
  })

  it('should properly set amount field', () => {
    expect(issuanceRecord.amount).to.equal(recordResponses.issuance.amount)
  })
  it('should properly set asset field', () => {
    expect(issuanceRecord.asset).to.equal(recordResponses.issuance.asset)
  })
  it('should properly set fixedFee field', () => {
    expect(issuanceRecord.fixedFee).to.equal(recordResponses.issuance.fee_fixed)
  })
  it('should properly set percentFee field', () => {
    expect(issuanceRecord.percentFee).to.equal(recordResponses.issuance.fee_percent)
  })
  it('should properly set subject field', () => {
    expect(issuanceRecord.subject).to.equal(recordResponses.issuance.reference)
  })
  it('should properly set counterparty field', () => {
    expect(issuanceRecord.counterparty).to.equal(mockCounterpartyId)
  })
  it('should properly set direction field', () => {
    expect(issuanceRecord.direction).to.equal('in')
  })
})
