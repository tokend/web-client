import { MockHelper } from '../test'
import { vuexTypes } from './types'

import kyc from './kyc.module'

import Vue from 'vue'
import Vuex from 'vuex'

import responseJSON from '../test/mocks/update-kyc'

Vue.use(Vuex)

describe('kyc.module end-to-end test', () => {
  describe('LOAD_KYC should update all the getters properly', () => {
    let store, mockHelper

    const accountId = 'GA4BFNAN3UHKCMK3Q5QVQFLANHHEGMOCDRHY6MN4OSPEPWOYGHYVY7M2'
    const latestBlobId = 'G6V2SIIY2KAP3NGZTJ5DJTBFFKPIC2LESBGQITXR64HXFPFOVPGA'
    const latestKycData = { first_name: 'Bob', last_name: 'Smith' }
    const kycState = 'approved'
    const kycStateI = 3

    beforeEach(async () => {
      mockHelper = new MockHelper()
      store = new Vuex.Store({
        actions: {},
        getters: {
          accountId: _ => accountId,
        },
        mutations: {},
        state: {},
        modules: { kyc },
      })
      mockHelper.useMockWallet({ accountId })
      mockHelper.mockEndpoint(`/accounts/${accountId}/blobs/${latestBlobId}`, {
        data:
          {
            id: latestBlobId,
            type: 'kyc_form',
            attributes:
              {
                value: JSON.stringify(latestKycData),
              },
          },
      })
      mockHelper.mockEndpoint(`/v3/change_role_requests?include=request_details&filter%5Brequestor%5D=${accountId}&page%5Blimit%5D=2&page%5Border%5D=desc`,
        responseJSON
      )
      await store.dispatch(vuexTypes.LOAD_KYC)
    })

    it('kycState', () => {
      expect(store.getters[vuexTypes.kycState])
        .to
        .equal(kycState)
    })

    it('kycStateI', () => {
      expect(store.getters[vuexTypes.kycStateI])
        .to
        .equal(kycStateI)
    })

    it('kycLatestData', () => {
      expect(store.getters[vuexTypes.kycLatestData])
        .to
        .deep
        .equal(latestKycData)
    })
  })
})
