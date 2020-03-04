import {
  REQUEST_STATES,
  REQUEST_STATES_STR,
} from '../js/const/request-states.const'
import { ChangeRoleRequestRecord } from '@/js/records/requests/change-role.record'
import { MockWrapper } from '../test'
import { api } from '@/api'
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

    it('SET_ACCOUNT_ROLE_RESETED should properly modify state', () => {
      const state = {
        isAccountRoleReseted: false,
      }
      mutations[vuexTypes.SET_ACCOUNT_ROLE_RESETED](state, true)

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

    it('SET_KYC_LATEST_REQUEST_DATA should properly modify state', () => {
      const state = {
        latestRequestData: '{}',
      }

      mutations[vuexTypes.SET_KYC_LATEST_REQUEST_DATA](
        state,
        JSON.stringify({
          first_name: 'John',
          last_name: 'Doe',
        })
      )

      expect(state).to.deep.equal({
        latestRequestData: '{"first_name":"John","last_name":"Doe"}',
      })
    })
  })

  describe('actions', () => {
    let store

    beforeEach(() => {
      store = {
        state: {},
        getters: {},
        commit: sinon.stub(),
        dispatch: sinon.stub(),
      }
    })

    it('LOAD_KYC should dispatch the proper set of actions', async () => {
      const expectedActions = [
        [vuexTypes.LOAD_KYC_LATEST_REQUEST],
        [vuexTypes.LOAD_KYC_LATEST_DATA],
      ]

      await actions[vuexTypes.LOAD_KYC](store)

      expect(store.dispatch.args).to.deep.equal(expectedActions)
    })

    it('LOAD_KYC_LATEST_REQUEST commits the proper set of mutations', async () => {
      sinon.stub(api, 'getWithSignature')
        .resolves(MockWrapper.makeJsonapiResponse(responseJSON))

      const expectedRequest = MockWrapper
        .makeJsonapiResponseData(responseJSON)[0]
      const expectedPayload = new ChangeRoleRequestRecord(expectedRequest)
      const expectedMutations = {
        [vuexTypes.SET_KYC_LATEST_REQUEST]: expectedPayload,
        [vuexTypes.SET_ACCOUNT_ROLE_RESETED]: false,
        [vuexTypes.SET_KYC_RELATED_REQUEST]: {},
      }

      store.rootGetters = {
        [vuexTypes.accountId]: 'GA3LMODDZGFASADC4NOSPBQRAAEJWZH76PHZAVUY2V3PHE7OAX52DXQH',
      }

      await actions[vuexTypes.LOAD_KYC_LATEST_REQUEST](store)

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
