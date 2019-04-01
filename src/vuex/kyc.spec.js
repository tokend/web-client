import {
  REQUEST_STATES,
  REQUEST_STATES_STR,
} from '../js/const/request-states.const'
import { ChangeRoleRequestRecord } from '@/js/records/requests/change-role.record'
import { MockHelper, MockWrapper } from '../test'
import { mutations, actions, getters } from './kyc.module'
import { vuexTypes } from './types'

import responseJSON from '../test/mocks/update-kyc'

describe('kyc.module', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    it('SET_KYC_LATEST_REQUEST should properly modify state', () => {
      const state = {
        request: {},
      }
      const request = {
        id: '2255625342224',
        details: {},
      }
      mutations[vuexTypes.SET_KYC_LATEST_REQUEST](state, request)

      expect(state).to.deep.equal({
        request,
      })
    })

    it('SET_ACCOUNT_ROLE_RESET should properly modify state', () => {
      const state = {
        isAccountRoleReseted: false,
      }
      mutations[vuexTypes.SET_ACCOUNT_ROLE_RESET](state, true)

      expect(state).to.deep.equal({
        isAccountRoleReseted: true,
      })
    })

    it('SET_KYC_LATEST_DATA should properly modify state', () => {
      const state = {
        latestData: '{}',
      }
      const latestData = JSON.stringify({
        first_name: 'Jonh',
        last_name: 'Doe',
      })
      mutations[vuexTypes.SET_KYC_LATEST_DATA](state, latestData)

      expect(state).to.deep.equal({
        latestData,
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
        dispatch: sinon.stub(),
      }
      mockHelper = new MockHelper()
    })

    it('LOAD_KYC should dispatch the proper set of actions', async () => {
      const expectedActions = [
        [vuexTypes.LOAD_KYC_LATEST_REQUEST],
        [vuexTypes.LOAD_KYC_DATA],
      ]

      await actions[vuexTypes.LOAD_KYC](store)

      expect(store.dispatch.args).to.deep.equal(expectedActions)
    })

    it('LOAD_KYC_LATEST_REQUEST commits the proper set of mutations', async () => {
      sinon.stub(mockHelper.apiInstance, 'getWithSignature')
        .resolves(MockWrapper.makeJsonapiResponse(responseJSON))

      const expectedRequest = MockWrapper
        .makeJsonapiResponseData(responseJSON)[0]
      const expectedPayload = new ChangeRoleRequestRecord(expectedRequest)
      const expectedMutations = {
        [vuexTypes.SET_ACCOUNT_ROLE_RESET]: false,
        [vuexTypes.SET_KYC_LATEST_REQUEST]: expectedPayload,
      }

      store.rootGetters = {
        [vuexTypes.accountId]: 'GA3LMODDZGFASADC4NOSPBQRAAEJWZH76PHZAVUY2V3PHE7OAX52DXQH',
      }

      await actions[vuexTypes.LOAD_KYC_LATEST_REQUEST](store)

      expect(store.commit.args).to.deep.equal(Object.entries(expectedMutations))
    })

    describe('LOAD_KYC_DATA commits the proper set of mutations', async () => {
      const blobId = 'THEBMLAOPWIIERIBJKMN....'
      const latestDataPayload = JSON.stringify({
        first_name: 'John', last_name: 'Doe',
      })

      let store
      const resource = mockHelper.getApiResourcePrototype('blobs')

      sinon.stub(resource, 'get')
        .withArgs(blobId)
        .resolves({
          data: {
            value: latestDataPayload,
          },
        })

      store = {
        state: {
          request: {
            blobId,
          },
        },
        getters: {},
        commit: sinon.stub(),
        dispatch: sinon.stub(),
      }

      const expectedMutation = vuexTypes.SET_KYC_LATEST_DATA
      const expectedMutations = {
        [expectedMutation]: latestDataPayload,
      }

      await actions[vuexTypes.LOAD_KYC_DATA](store)

      expect(store.commit.args).to.deep.equal(Object.entries(expectedMutations))
    })
  })

  describe('getters', () => {
    it('kycState', () => {
      const state = {
        request: { state: REQUEST_STATES_STR.approved },
      }

      expect(getters[vuexTypes.kycState](state))
        .to
        .equal(REQUEST_STATES_STR.approved)
    })

    it('kycStateI', () => {
      const state = {
        request: { stateI: REQUEST_STATES.approved },
      }

      expect(getters[vuexTypes.kycStateI](state))
        .to
        .equal(REQUEST_STATES.approved)
    })

    it('kycLatestData', () => {
      const state = {
        latestData: JSON.stringify({
          first_name: 'Jack',
          last_name: 'Smith',
        }),
      }

      expect(getters[vuexTypes.kycLatestData](state))
        .to
        .deep
        .equal({
          first_name: 'Jack',
          last_name: 'Smith',
        })
    })
  })
})
