import Vue from 'vue'
import Vuex from 'vuex'

import account from './account.module'
import factors from './factors.module'
import wallet from './wallet.module'
import kyc from './kyc.module'

import { vuexTypes } from '@/vuex/types'
import { sessionStoragePlugin } from './plugins/session-storage'

import _isEmpty from 'lodash/isEmpty'

Vue.use(Vuex)

const store = new Vuex.Store({
  actions: {},
  mutations: {
    // These mutations are being subscribed by plugins
    [vuexTypes.KEEP_SESSION] () {},
    [vuexTypes.POP_STATE] () {},
    [vuexTypes.CLEAR_STATE] () {}
  },
  getters: {
    [vuexTypes.isLoggedIn]: (_, getters) => !_isEmpty(
      getters[vuexTypes.account]
    )
  },
  state: {},
  modules: {
    account,
    factors,
    wallet,
    kyc
  },
  plugins: [sessionStoragePlugin]
})

store.commit(vuexTypes.POP_STATE)

export { store }

export { vuexTypes } from './types'
