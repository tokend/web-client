import { walletsManager } from '@/api'
import { vuexTypes } from './types'
import { Wallet } from '@tokend/js-sdk'
import Vue from 'vue'
import Vuex from 'vuex'

import wallet from './wallet.module'

Vue.use(Vuex)

describe('wallet.module end-to-end test', () => {
  describe('dispatching LOAD_WALLET should update all the getters properly', () => {
    const email = 'foo@bar.com'
    const password = 'qqq123'
    const accountId = 'GA466LXRPTTXV2JGDCVAWBB54SW4MGSYFABNUOYYKPJULF64DEPVOMMR'
    const seed = 'SBMI5HFNBRFIA66G2HZWVOVQRPOXZA537DEZR3ZIWX7NVSSKVGAQC4K2'
    const sessionId = '01DES43BFYPNHGRWY4TZKNC60W'
    const sessionKey = '0c37f0e5234718ff8cccad6445b950d7842eee54012f3da6036b96c46c1c7135'

    // Manually calculated:
    const walletId = '564398cca354e752a02a315fa93354f5e64a3dde687ef155d849b5931b3ed2a4'

    let store

    beforeEach(async () => {
      store = new Vuex.Store({
        actions: {},
        getters: {},
        mutations: {},
        state: {},
        modules: { wallet },
      })
      sinon.stub(walletsManager, 'getKdfParams').resolves({
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
      sinon.stub(walletsManager, 'get').resolves(
        new Wallet(email, seed, accountId, walletId, sessionId, sessionKey),
      )
      await store.dispatch(vuexTypes.LOAD_WALLET, { email, password })
    })

    afterEach(() => {
      sinon.restore()
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
  })
})
