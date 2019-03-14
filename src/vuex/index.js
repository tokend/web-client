import Vue from 'vue'
import Vuex from 'vuex'

import account from './account.module'
import factors from './factors.module'
import wallet from './wallet.module'
import kyc from './kyc.module'
import keyValue from './key-value.module'

// import { documentSignersManager } from
// '@/vue/modules/documents/document-manager/modules/signers-manager/store'
// 'document-signers-manager': documentSignersManager,
import { vuexTypes } from '@/vuex/types'
import { sessionStoragePlugin } from './plugins/session-storage'

import _isEmpty from 'lodash/isEmpty'
import { SchemeRegistry } from '@/modules-arch/scheme-registry'

Vue.use(Vuex)

export const rootModule = {
  actions: {},
  mutations: {
    // These mutations are being subscribed by plugins
    [vuexTypes.POP_STATE] () { },
    [vuexTypes.CLEAR_STATE] () { },
  },
  getters: {
    [vuexTypes.isLoggedIn]: (_, getters) => !_isEmpty(
      getters[vuexTypes.account]
    ),
  },
  state: {},
}

let store = {}
async function buildStore () {
  const stores = (await Promise
    .all(
      SchemeRegistry.current.cache
        .filter(item => item.importStoreFn)
        .map(item => item.importStoreFn())
    ))
    .reduce((res, item) => ({ ...res, [item.name]: item }))

  store = new Vuex.Store({
    ...rootModule,
    modules: {
      account,
      factors,
      wallet,
      kyc,
      keyValue,
      ...stores,
    },
    plugins: [sessionStoragePlugin],
  })

  store.commit(vuexTypes.POP_STATE)

  return store
}

export { buildStore, store }
export { vuexTypes } from './types'
