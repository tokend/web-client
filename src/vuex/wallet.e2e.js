import { Api } from '@/api'
import { vuexTypes } from './types'

import { base, Wallet } from '@tokend/js-sdk'

import Vue from 'vue'
import Vuex from 'vuex'

import wallet from './wallet.module'

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

    let store

    beforeEach(async () => {
      Api.initSync({ horizonURL: 'https://test.api.com' })

      store = new Vuex.Store({
        actions: {},
        getters: {},
        mutations: {},
        state: {},
        modules: { wallet },
      })
      sinon.stub(Api.walletsManager, 'getKdfParams').resolves({
        data: {
          type: 'kdf',
          id: '2',
          attributes: {
            algorithm: 'scrypt',
            bits: 256,
            n: 4096,
            r: 8,
            p: 1,
            salt: 'Ux94WBwVfIEh6GQuc9CeAQ==',
          },
        },
      })
      sinon.stub(Api.walletsManager, 'get').resolves(
        new Wallet(email, seed, accountId, walletId)
      )
      await store.dispatch(vuexTypes.LOAD_WALLET, { email, password })
    })

    it('walletId', () => {
      expect(store.getters[vuexTypes.walletId])
        .to
        .equal(walletId)
    })
    it('walletEmail', () => {
      expect(store.getters[vuexTypes.walletEmail])
        .to
        .equal(email)
    })
    it('walletSeed', () => {
      expect(store.getters[vuexTypes.walletSeed])
        .to
        .equal(seed)
    })
    it('walletKeypair', () => {
      expect(store.getters[vuexTypes.walletKeypair])
        .to
        .deep
        .equal(base.Keypair.fromSecret(seed))
    })
    it('walletPublicKey', () => {
      expect(store.getters[vuexTypes.walletPublicKey])
        .to
        .equal(publicKey)
    })
  })
})
