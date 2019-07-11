import Vue from 'vue'
import Vuex from 'vuex'

import account from './account.module'
import assets from './assets.module'
import factors from './factors.module'
import wallet from './wallet.module'
import kyc from './kyc.module'
import keyValue from './key-value.module'
import kycRecovery from './kyc-recovery.module'
import { vuexTypes } from '@/vuex/types'
import { sessionStoragePlugin } from './plugins/session-storage'

import _isEmpty from 'lodash/isEmpty'

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

let store
function buildStore (storeModules = []) {
  store = new Vuex.Store({
    ...rootModule,
    modules: {
      account,
      assets,
      factors,
      wallet,
      kyc,
      keyValue,
      kycRecovery,
      ...storeModules,
    },
    plugins: [sessionStoragePlugin],
  })

  store.commit(vuexTypes.POP_STATE)

  return store
}
buildStore()

async function extendStoreWithScheme (scheme = []) {
  const storeModules = (await Promise
    .all(
      scheme.cache
        .filter(item => item.importStoreFn)
        .map(item => item.importStoreFn())
    ))
    .reduce((res, item) => ({ ...res, [item.name]: item }), [])

  return buildStore(storeModules)
}

export { extendStoreWithScheme, store }
export { vuexTypes } from './types'
