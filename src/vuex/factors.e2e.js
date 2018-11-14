import { MockHelper } from '../test'
import { vuexTypes } from './types'

import { factors } from './index'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

describe('factors.module end-to-end test', () => {
  describe('LOAD_FACTORS should update all the getters properly', () => {
    const responseDefaultRaw = {
      data: [
        { type: 'email', id: 785, attributes: { priority: 1 } },
        { type: 'password', id: 652, attributes: { priority: 1 } },
        { type: 'totp', id: 991, attributes: { priority: 1 } }
      ]
    }

    const responseDefaultParsed = [
      { resourceType: 'email', id: 785, priority: 1 },
      { resourceType: 'password', id: 652, priority: 1 },
      { resourceType: 'totp', id: 991, priority: 1 }
    ]

    const walletId = '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'

    let store, mockHelper

    beforeEach(() => {
      mockHelper = new MockHelper()
      store = new Vuex.Store({
        actions: {},
        getters: {},
        mutations: {},
        state: {},
        modules: { factors }
      })
      mockHelper.mockWallet({ walletId })
    })

    it('factors', async () => {
      mockHelper.mockEndpoint(
        `/wallets/${walletId}/factors`,
        responseDefaultRaw
      )
      await store.dispatch(vuexTypes.LOAD_FACTORS)
      expect(store.getters.factors).to.deep.equal(responseDefaultParsed)
    })

    it('factorsTotp', async () => {
      mockHelper.mockEndpoint(
        `/wallets/${walletId}/factors`,
        responseDefaultRaw
      )
      await store.dispatch(vuexTypes.LOAD_FACTORS)
      expect(store.getters.factorsTotp).to.deep.equal(
        responseDefaultParsed.slice(2, 3)
      )
    })

    it('factorsPassword', async () => {
      mockHelper.mockEndpoint(
        `/wallets/${walletId}/factors`,
        responseDefaultRaw
      )
      await store.dispatch(vuexTypes.LOAD_FACTORS)
      expect(store.getters.factorsPassword)
        .to
        .deep
        .equal(responseDefaultParsed.slice(1, 2))
    })

    it('factorsEmail', async () => {
      mockHelper.mockEndpoint(
        `/wallets/${walletId}/factors`,
        responseDefaultRaw
      )
      await store.dispatch(vuexTypes.LOAD_FACTORS)
      expect(store.getters.factorsEmail)
        .to
        .deep
        .equal(responseDefaultParsed.slice(0, 1))
    })

    it('factorsTotpEnabled with enabled totp factor', async () => {
      mockHelper.mockEndpoint(`/wallets/${walletId}/factors`, {
        data: [
          { type: 'email', id: 785, attributes: { priority: 1 } },
          { type: 'password', id: 652, attributes: { priority: 1 } },
          { type: 'totp', id: 991, attributes: { priority: 1 } }
        ]
      })
      await store.dispatch(vuexTypes.LOAD_FACTORS)
      expect(store.getters.factorsTotpEnabled).to.deep.equal([
        { resourceType: 'totp', id: 991, priority: 1 }
      ])
    })

    it('factorsTotpEnabled when no enabled totp factor', async () => {
      mockHelper.mockEndpoint(`/wallets/${walletId}/factors`, {
        data: [
          { type: 'password', id: 652, attributes: { priority: 1 } },
          { type: 'totp', id: 991, attributes: { priority: 0 } }
        ]
      })

      await store.dispatch(vuexTypes.LOAD_FACTORS)
      expect(store.getters.factorsTotpEnabled).to.deep.equal([])
    })

    it('isTotpEnabled with enabled totp factor', async () => {
      mockHelper.mockEndpoint(`/wallets/${walletId}/factors`, {
        data: [
          { type: 'email', id: 785, attributes: { priority: 1 } },
          { type: 'password', id: 652, attributes: { priority: 1 } },
          { type: 'totp', id: 991, attributes: { priority: 1 } }
        ]
      })

      await store.dispatch(vuexTypes.LOAD_FACTORS)
      expect(store.getters.isTotpEnabled).to.equal(true)
    })

    it('isTotpEnabled whe no enabled totp factor', async () => {
      mockHelper.mockEndpoint(`/wallets/${walletId}/factors`, {
        data: [
          { type: 'password', id: 652, attributes: { priority: 1 } },
          { type: 'totp', id: 991, attributes: { priority: 0 } }
        ]
      })

      await store.dispatch(vuexTypes.LOAD_FACTORS)
      expect(store.getters.isTotpEnabled).to.equal(false)
    })
  })
})
