import {
  REQUEST_STATES,
  REQUEST_STATES_STR
} from '../js/const/request-states.const'
import { RecordWrapper } from '../js/records'
import { MockHelper, MockWrapper } from '../test'
import { mutations, actions, getters } from './kyc.module'
import { vuexTypes } from './types'

import responseJSON from '../test/mocks/update-kyc-multiple'

describe('kyc.module', () => {
  beforeEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    let state

    beforeEach(() => {
      state = {
        request: {},
        approvedData: '',
        latestData: ''
      }
    })

    it('SET_KYC_LATEST_REQUEST should properly modify state', () => {
      const request = {
        id: '2255625342224',
        details: {}
      }
      mutations.SET_KYC_LATEST_REQUEST(state, request)

      expect(state).to.deep.equal({
        request,
        approvedData: '',
        latestData: ''
      })
    })

    it('SET_KYC_LATEST_DATA should properly modify state', () => {
      const latestData = JSON.stringify({
        first_name: 'Jonh',
        last_name: 'Doe'
      })
      mutations.SET_KYC_LATEST_DATA(state, latestData)

      expect(state).to.deep.equal({
        request: {},
        approvedData: '',
        latestData
      })
    })

    it('SET_KYC_APPROVED_DATA should properly modify state', () => {
      const approvedData = JSON.stringify({
        first_name: 'Bob',
        last_name: 'Smith'
      })
      mutations.SET_KYC_APPROVED_DATA(state, approvedData)

      expect(state).to.deep.equal({
        request: {},
        latestData: '',
        approvedData
      })
    })
  })

  describe('actions', () => {
    let store
    let mockHelper

    beforeEach(() => {
      store = {
        state: {},
        getters: {},
        commit: sinon.stub(),
        dispatch: sinon.stub()
      }
      mockHelper = new MockHelper()
    })

    it('LOAD_KYC should dispatch the proper set of actions', async () => {
      const expectedActions = [
        [vuexTypes.LOAD_KYC_LATEST_REQUEST],
        [vuexTypes.LOAD_KYC_DATA]
      ]

      await actions.LOAD_KYC(store)

      expect(store.dispatch.args).to.deep.equal(expectedActions)
    })

    it('LOAD_KYC_LATEST_REQUEST commits the proper set of mutations', async () => {
      mockHelper.mockHorizonMethod('request', 'getAllForUpdateKyc', responseJSON)

      const expectedRequest = MockWrapper.makeHorizonResponse(
        responseJSON
      ).data[0]
      const expectedPayload = RecordWrapper.request(expectedRequest)
      const expectedMutation = vuexTypes.SET_KYC_LATEST_REQUEST
      const expectedMutations = {
        [expectedMutation]: expectedPayload
      }

      store.rootGetters = {
        accountId: 'GA3LMODDZGFASADC4NOSPBQRAAEJWZH76PHZAVUY2V3PHE7OAX52DXQH'
      }

      await actions.LOAD_KYC_LATEST_REQUEST(store)

      expect(store.commit.args).to.deep.equal(Object.entries(expectedMutations))
    })

    describe('LOAD_KYC_DATA', _ => {
      const blobId = 'THEBMLAOPWIIERIBJKMN....'
      const anotherBlobId = 'IKNEBHFBWEHVER....'
      const latestDataPayload = JSON.stringify({
        first_name: 'John', last_name: 'Doe'
      })
      const approvedDataPayload = JSON.stringify({
        first_name: 'Bob', last_name: 'Doe'
      })

      let store

      beforeEach(() => {
        const resource = mockHelper.getApiResourcePrototype('blobs')

        sinon.stub(resource, 'get')
          .withArgs(blobId)
          .resolves({
            data: {
              value: latestDataPayload
            }
          })
          .withArgs(anotherBlobId)
          .resolves({
            data: {
              value: approvedDataPayload
            }
          })

        store = {
          state: {
            request: {
              blobId
            }
          },
          getters: {},
          commit: sinon.stub(),
          dispatch: sinon.stub()
        }
      })

      it('should properly commit the mutations when latest blob id === account blob id', async () => {
        store.rootGetters = { accountKycBlobId: blobId }

        await actions.LOAD_KYC_DATA(store)

        const expectedMutations = {
          [vuexTypes.SET_KYC_LATEST_DATA]: latestDataPayload,
          [vuexTypes.SET_KYC_APPROVED_DATA]: latestDataPayload
        }

        expect(store.commit.args)
          .to
          .deep
          .equal(Object.entries(expectedMutations))
      })

      it('should properly commit the mutations when latest blob id !== account blob id', async () => {
        store.rootGetters = { accountKycBlobId: anotherBlobId }

        await actions.LOAD_KYC_DATA(store)

        const expectedMutations = {
          [vuexTypes.SET_KYC_LATEST_DATA]: latestDataPayload,
          [vuexTypes.SET_KYC_APPROVED_DATA]: approvedDataPayload
        }

        expect(store.commit.args)
          .to
          .deep
          .equal(Object.entries(expectedMutations))
      })
    })
  })

  describe('getters', () => {
    it('kycState', () => {
      const state = {
        request: { state: REQUEST_STATES_STR.approved }
      }

      expect(getters.kycState(state)).to.equal(REQUEST_STATES_STR.approved)
    })

    it('kycStateI', () => {
      const state = {
        request: { stateI: REQUEST_STATES.approved }
      }

      expect(getters.kycStateI(state)).to.equal(REQUEST_STATES.approved)
    })

    it('kycLatestData', () => {
      const state = {
        latestData: JSON.stringify({
          first_name: 'Jack',
          last_name: 'Smith'
        })
      }

      expect(getters.kycLatestData(state)).to.deep.equal({
        first_name: 'Jack',
        last_name: 'Smith'
      })
    })

    it('kycApprovedData', () => {
      const state = {
        approvedData: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Doe'
        })
      }

      expect(getters.kycApprovedData(state)).to.deep.equal({
        first_name: 'Jane',
        last_name: 'Doe'
      })
    })
  })
})
