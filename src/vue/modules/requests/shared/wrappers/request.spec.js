import { Request } from './request'
import { REQUEST_STATES } from '@/js/const/request-states.const'

describe('Asset creation request', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        id: '1',
        createdAt: '2019-03-18T10:22:00Z',
        updatedAt: '2019-03-19T15:25:00Z',
        stateI: 3,
        rejectReason: 'Some reason',
      }

      const result = new Request(record)

      expect(result.id).to.equal('1')

      expect(result.createdAt).to.equal('2019-03-18T10:22:00Z')
      expect(result.updatedAt).to.equal('2019-03-19T15:25:00Z')

      expect(result.stateI).to.equal(3)
      expect(result.rejectReason).to.equal('Some reason')
    })
  })

  describe('getters', () => {
    describe('isApproved', () => {
      it('returns true if the request has approved state', () => {
        const request = new Request({
          stateI: REQUEST_STATES.approved,
        })

        expect(request.isApproved).to.be.true
      })

      it('returns false if the request does not have approved state', () => {
        const request = new Request({
          stateI: REQUEST_STATES.pending,
        })

        expect(request.isApproved).to.be.false
      })
    })

    describe('isPending', () => {
      it('returns true if the request has pending state', () => {
        const request = new Request({
          stateI: REQUEST_STATES.pending,
        })

        expect(request.isPending).to.be.true
      })

      it('returns false if the request does not have pending state', () => {
        const request = new Request({
          stateI: REQUEST_STATES.approved,
        })

        expect(request.isPending).to.be.false
      })
    })

    describe('isRejected', () => {
      it('returns true if the request has rejected state', () => {
        const request = new Request({
          stateI: REQUEST_STATES.rejected,
        })

        expect(request.isRejected).to.be.true
      })

      it('returns false if the request does not have rejected state', () => {
        const request = new Request({
          stateI: REQUEST_STATES.approved,
        })

        expect(request.isRejected).to.be.false
      })
    })

    describe('isPermanentlyRejected', () => {
      it('returns true if the request has permanently rejected state', () => {
        const request = new Request({
          stateI: REQUEST_STATES.permanentlyRejected,
        })

        expect(request.isPermanentlyRejected).to.be.true
      })

      it('returns false if the request does not have permanently rejected state', () => {
        const request = new Request({
          stateI: REQUEST_STATES.pending,
        })

        expect(request.isPermanentlyRejected).to.be.false
      })
    })

    describe('isCanceled', () => {
      it('returns true if the request has canceled state', () => {
        const request = new Request({
          stateI: REQUEST_STATES.canceled,
        })

        expect(request.isCanceled).to.be.true
      })

      it('returns false if the request does not have canceled state', () => {
        const request = new Request({
          stateI: REQUEST_STATES.approved,
        })

        expect(request.isCanceled).to.be.false
      })
    })
  })
})
