import { vuexTypes } from './types'

import kyc from './kyc.module'

import Vue from 'vue'
import Vuex from 'vuex'

import responseJSON from '../test/mocks/update-kyc'

import { api } from '@/api'
import { MockWrapper } from '@/test'

Vue.use(Vuex)

describe('kyc.module end-to-end test', () => {
  describe('LOAD_KYC should update all the getters properly', () => {
    let store

    const latestKycData = { first_name: 'Bob', last_name: 'Smith' }
    const kycState = 'approved'
    const kycStateI = 3

    beforeEach(async () => {
      store = new Vuex.Store({
        actions: {},
        getters: { accountId: _ => 'SOME_ACCOUNT_ID' },
        mutations: {},
        state: {},
        modules: { kyc },
      })

      sinon.stub(api, 'getWithSignature')
        .withArgs('/v3/accounts/SOME_ACCOUNT_ID', { include: ['kyc_data'] })
        .resolves({
          data: {
            kycData: { kycData: { blobId: 'BLOB_ID' } },
          },
        })
        .withArgs('/v3/change_role_requests', {
          filter: { requestor: 'SOME_ACCOUNT_ID' },
          page: { limit: 1, order: 'desc' },
          include: ['request_details'],
        })
        .resolves(MockWrapper.makeJsonapiResponse(responseJSON))
        .withArgs('/accounts/SOME_ACCOUNT_ID/blobs/BLOB_ID')
        .resolves({ data: { value: JSON.stringify(latestKycData) } })

      await store.dispatch(vuexTypes.LOAD_KYC)
    })

    afterEach(() => {
      api.getWithSignature.restore()
    })

    it('kycState', () => {
      expect(store.getters[vuexTypes.kycState])
        .to.equal(kycState)
    })

    it('kycStateI', () => {
      expect(store.getters[vuexTypes.kycStateI])
        .to.equal(kycStateI)
    })

    it('kycLatestData', () => {
      expect(store.getters[vuexTypes.kycLatestData])
        .to.deep.equal(latestKycData)
    })
  })
})
