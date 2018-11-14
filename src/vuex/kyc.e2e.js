import { MockHelper } from '../test'
import { vuexTypes } from './types'

import { kyc } from './index'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

describe('kyc.module end-to-end test', () => {
  describe('LOAD_KYC should update all the getters properly', () => {
    let store, mockHelper

    const accountId = 'GA4BFNAN3UHKCMK3Q5QVQFLANHHEGMOCDRHY6MN4OSPEPWOYGHYVY7M2'
    const approvedBlobId = 'DSXDXJEHWAGTITUIESTUWW6PAAJYBJFYUT6DCEI6UAI6TSONWMXA'
    const latestBlobId = '4NSI4HPWFHLZTUB3QPURTUPZMHID4OI6CDUZVJAREUIEAJMRLE6A'
    const approvedKycData = { first_name: 'Jonh', last_name: 'Doe' }
    const latestKycData = { first_name: 'Bob', last_name: 'Smith' }
    const kycState = 'pending'
    const kycStateI = 3

    beforeEach(async () => {
      mockHelper = new MockHelper()
      store = new Vuex.Store({
        actions: {},
        getters: {
          accountId: _ => accountId,
          accountKycBlobId: _ => approvedBlobId
        },
        mutations: {},
        state: {},
        modules: { kyc }
      })
      mockHelper.mockWallet({ accountId })
      mockHelper.mockEndpoint(`/blobs/${latestBlobId}`, {
        data: {
          value: JSON.stringify(latestKycData)
        }
      })
      mockHelper.mockEndpoint(`/users/${accountId}/blobs/${latestBlobId}`, {
        data:
          {
            id: latestBlobId,
            type: 'kyc_form',
            attributes:
              {
                value: JSON.stringify(latestKycData)
              }
          }
      })
      mockHelper.mockEndpoint(`/users/${accountId}/blobs/${approvedBlobId}`, {
        data: {
          id: approvedBlobId,
          type: 'kyc_form',
          attributes: { value: JSON.stringify(approvedKycData) }
        }
      })
      mockHelper.mockEndpoint(`/request/update_kyc?requestor=${accountId}&limit=1&order=desc`, {
        '_links': {
          'self': { 'href': '' },
          'next': { 'href': '' },
          'prev': { 'href': '' }
        },
        '_embedded': {
          'records': [
            {
              'id': '734',
              'paging_token': '734',
              'requestor': accountId,
              'reviewer': 'GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636',
              'reference': '3b28a6c3766c6295adad976d349705ef49393fbfdebe4facb5862d2cdfa285d3',
              'reject_reason': '',
              'hash': '9dfe099b40545901544549c0490b2250725245c2fe8aa3235c75c9d3a3e1128c',
              'details': {
                'request_type_i': 9,
                'request_type': 'update_kyc',
                'update_kyc': {
                  'account_to_update_kyc': accountId,
                  'account_type_to_set': {
                    'int': 10,
                    'string': 'verified'
                  },
                  'kyc_level': 0,
                  'kyc_data': {
                    'blob_id': latestBlobId
                  },
                  'all_tasks': 30,
                  'pending_tasks': 0,
                  'sequence_number': 0,
                  'external_details': [
                    {}
                  ]
                }
              },
              'created_at': '2018-09-07T20:24:15Z',
              'updated_at': '2018-09-07T20:25:30Z',
              'request_state_i': kycStateI,
              'request_state': kycState
            }
          ]
        }
      })
      await store.dispatch(vuexTypes.LOAD_KYC)
    })

    it('kycState', () => {
      expect(store.getters.kycState).to.equal(kycState)
    })

    it('kycStateI', () => {
      expect(store.getters.kycStateI).to.equal(kycStateI)
    })

    it('kycLatestData', () => {
      expect(store.getters.kycLatestData).to.deep.equal(latestKycData)
    })

    it('kycApprovedData', () => {
      expect(store.getters.kycApprovedData).to.deep.equal(approvedKycData)
    })
  })
})
