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
        xdrType: {
          value: 4,
        },
        rejectReason: 'Some reason',
        requestor: {
          id: 'REQUESTOR_ACCOUNT_ID',
        },
        hash: 'REQUEST_HASH',
        pendingTasks: 2048,
      }

      const result = new Request(record)

      expect(result.id).to.equal('1')

      expect(result.createdAt).to.equal('2019-03-18T10:22:00Z')
      expect(result.updatedAt).to.equal('2019-03-19T15:25:00Z')

      expect(result.requestor).to.equal('REQUESTOR_ACCOUNT_ID')
      expect(result.hash).to.equal('REQUEST_HASH')
      expect(result.pendingTasks).to.equal(2048)

      expect(result.stateI).to.equal(3)
      expect(result.typeI).to.equal(4)
      expect(result.rejectReason).to.equal('Some reason')
    })
  })

  describe('getters', () => {
    describe('isApproved', () => {
      it('returns true only if the request has approved state', () => {
        let request = new Request({ stateI: REQUEST_STATES.approved })
        expect(request.isApproved).to.be.true

        request = new Request({ stateI: REQUEST_STATES.pending })
        expect(request.isApproved).to.be.false

        request = new Request({ stateI: REQUEST_STATES.rejected })
        expect(request.isApproved).to.be.false

        request = new Request({ stateI: REQUEST_STATES.canceled })
        expect(request.isApproved).to.be.false

        request = new Request({ stateI: REQUEST_STATES.permanentlyRejected })
        expect(request.isApproved).to.be.false
      })
    })

    describe('isPending', () => {
      it('returns true only if the request has pending state', () => {
        let request = new Request({ stateI: REQUEST_STATES.pending })
        expect(request.isPending).to.be.true

        request = new Request({ stateI: REQUEST_STATES.approved })
        expect(request.isPending).to.be.false

        request = new Request({ stateI: REQUEST_STATES.rejected })
        expect(request.isPending).to.be.false

        request = new Request({ stateI: REQUEST_STATES.canceled })
        expect(request.isPending).to.be.false

        request = new Request({ stateI: REQUEST_STATES.permanentlyRejected })
        expect(request.isPending).to.be.false
      })
    })

    describe('isRejected', () => {
      it('returns true only if the request has rejected state', () => {
        let request = new Request({ stateI: REQUEST_STATES.rejected })
        expect(request.isRejected).to.be.true

        request = new Request({ stateI: REQUEST_STATES.approved })
        expect(request.isRejected).to.be.false

        request = new Request({ stateI: REQUEST_STATES.pending })
        expect(request.isRejected).to.be.false

        request = new Request({ stateI: REQUEST_STATES.canceled })
        expect(request.isRejected).to.be.false

        request = new Request({ stateI: REQUEST_STATES.permanentlyRejected })
        expect(request.isRejected).to.be.false
      })
    })

    describe('isPermanentlyRejected', () => {
      it('returns true only if the request has permanently rejected state', () => {
        let request = new Request({
          stateI: REQUEST_STATES.permanentlyRejected,
        })
        expect(request.isPermanentlyRejected).to.be.true

        request = new Request({ stateI: REQUEST_STATES.approved })
        expect(request.isPermanentlyRejected).to.be.false

        request = new Request({ stateI: REQUEST_STATES.pending })
        expect(request.isPermanentlyRejected).to.be.false

        request = new Request({ stateI: REQUEST_STATES.canceled })
        expect(request.isPermanentlyRejected).to.be.false

        request = new Request({ stateI: REQUEST_STATES.rejected })
        expect(request.isPermanentlyRejected).to.be.false
      })
    })

    describe('isCanceled', () => {
      it('returns true only if the request has canceled state', () => {
        let request = new Request({ stateI: REQUEST_STATES.canceled })
        expect(request.isCanceled).to.be.true

        request = new Request({ stateI: REQUEST_STATES.approved })
        expect(request.isCanceled).to.be.false

        request = new Request({ stateI: REQUEST_STATES.pending })
        expect(request.isCanceled).to.be.false

        request = new Request({ stateI: REQUEST_STATES.rejected })
        expect(request.isCanceled).to.be.false

        request = new Request({ stateI: REQUEST_STATES.permanentlyRejected })
        expect(request.isCanceled).to.be.false
      })
    })
  })
})
