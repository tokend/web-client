import { ReviewRequestOp } from './review-request'

describe('ReviewRequestOp', () => {
  it('properly parses the record', () => {
    const record = {
      requestHash: 't2nMkj21Lo21',
      action: {
        name: 'reject',
        value: 2,
      },
      reason: 'Invalid details',
      requestId: '55',
      isFulfilled: false,
      addedTasks: 0,
      removedTasks: 0,
      externalDetails: {
        hello: 'world',
      },
    }

    const result = new ReviewRequestOp(record)

    expect(result.actionValue).to.equal(2)
    expect(result.reason).to.equal('Invalid details')
    expect(result.isFulfilled).to.equal(false)

    expect(result.externalDetails).to.have
      .property('hello')
      .equal('world')
  })

  describe('isApprove', () => {
    it('returns true for "approve" enum value', () => {
      const record = {
        action: {
          value: 1,
          name: 'approve',
        },
      }

      const result = new ReviewRequestOp(record)

      expect(result.isApprove).to.be.true
    })
  })

  describe('isReject', () => {
    it('returns true for "reject" enum value', () => {
      const record = {
        action: {
          value: 2,
          name: 'reject',
        },
      }

      const result = new ReviewRequestOp(record)

      expect(result.isReject).to.be.true
    })
  })

  describe('isPermanentReject', () => {
    it('returns true for "permanentReject" enum value', () => {
      const record = {
        action: {
          value: 3,
          name: 'permanentReject',
        },
      }

      const result = new ReviewRequestOp(record)

      expect(result.isPermanentReject).to.be.true
    })
  })
})
