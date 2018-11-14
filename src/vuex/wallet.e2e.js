import { MockHelper } from '../test'
import { vuexTypes } from './types'

import { base } from '@tokend/js-sdk'

import Vue from 'vue'
import Vuex from 'vuex'

import { wallet } from './index'

Vue.use(Vuex)

describe('wallet.module end-to-end test', () => {
  describe('dispatching LOAD_WALLET should update all the getters properly', () => {
    const email = 'foo@bar.com'
    const password = 'qqq123'
    const accountId = 'GA466LXRPTTXV2JGDCVAWBB54SW4MGSYFABNUOYYKPJULF64DEPVOMMR'
    const publicKey = 'GA6VATF6Z2UB3CI5WQF3UMXHYRSTV5Z5ET5NEDNEGMEXEMOYWUJ246KO'
    const seed = 'SBMI5HFNBRFIA66G2HZWVOVQRPOXZA537DEZR3ZIWX7NVSSKVGAQC4K2'

    // Manually calculated:
    const walletId = '564398cca354e752a02a315fa93354f5e64a3dde687ef155d849b5931b3ed2a4'
    const encryptedKeychain = 'eyJJViI6IllDRUppaWEzZWQ1ei9maTgiLCJjaXBoZXJUZXh0IjoiYmp4QUlJS0lwYlVreWkyV1NJSlVpaWRGZUZtOU1CZlkrNS81dEJsWXBHbUJVQ0d0Ylh5MFJqL3dSRitDT1lOdnRkQzdvSS9TczdENDlKMUtjckMrL3dJREl4dXg4bEVuSTlQTzV4MTdScFMxa0twaDJtYWhzNHAvVkJ4L0VMU3dYUFZFeWVCdUNBYnlFM0puaU16eVZsd3hrYUd6TEVFZ3ZlZFFOdUd0U1B5Q0ttdEM1Tms3ai9MKy9QcnFxeWZrelJMR2lMdWZLTXhRcEE9PSIsImNpcGhlck5hbWUiOiJhZXMiLCJtb2RlTmFtZSI6ImdjbSJ9'

    let store, mockHelper

    beforeEach(async () => {
      mockHelper = new MockHelper()
      store = new Vuex.Store({
        actions: {},
        getters: {},
        mutations: {},
        state: {},
        modules: { wallet }
      })
      mockHelper.mockEndpoint(`/kdf?email=${email}&is_recovery=false`, {
        data: {
          type: 'kdf',
          id: '2',
          attributes: {
            algorithm: 'scrypt',
            bits: 256,
            n: 4096,
            r: 8,
            p: 1,
            salt: 'Ux94WBwVfIEh6GQuc9CeAQ=='
          }
        }
      })
      mockHelper.mockEndpoint(`/wallets/${walletId}`, {
        data: {
          type: 'wallet',
          id: walletId,
          attributes: {
            email: email,
            verified: true,
            account_id: accountId,
            keychain_data: encryptedKeychain,
            last_sent_at: '2018-04-20T14:29:35.816633Z'
          },
          relationships: {}
        }
      })
      await store.dispatch(vuexTypes.LOAD_WALLET, { email, password })
    })

    it('walletId', () => {
      expect(store.getters.walletId).to.equal(walletId)
    })
    it('walletEmail', () => {
      expect(store.getters.walletEmail).to.equal(email)
    })
    it('walletSeed', () => {
      expect(store.getters.walletSeed).to.equal(seed)
    })
    it('walletKeypair', () => {
      expect(store.getters.walletKeypair)
        .to
        .deep
        .equal(base.Keypair.fromSecret(seed))
    })
    it('walletPublicKey', () => {
      expect(store.getters.walletPublicKey).to.equal(publicKey)
    })
  })
})
