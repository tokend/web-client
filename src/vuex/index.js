import Vue from 'vue'
import Vuex from 'vuex'

import account from './account.module'
import factors from './factors.module'
import wallet from './wallet.module'
import kyc from './kyc.module'
import keyValue from './key-value.module'

// TODO: modularize
// import { createAssetSaleModule } from '@/vue/modules/create-asset-sale/store'
// import { dividendFormModule } from '@/vue/modules/dividend-form/store'
// import { withdrawalFiatModule } from '@/vue/modules/withdrawal-fiat/store'
// import { withdrawalFiatBankModule } from
//   '@/vue/modules/withdrawal-fiat-bank/store'`
// import { withdrawalFiatCardModule } from
//   '@/vue/modules/withdrawal-fiat-card/store'
// import { depositFiatBankModule } from '@/vue/modules/deposit-fiat-bank/store'
// import { depositFiatCardModule } from '@/vue/modules/deposit-fiat-card/store'
// 'create-asset-sale': createAssetSaleModule,
// 'dividend-form': dividendFormModule,
// 'withdrawal-fiat': withdrawalFiatModule,
// 'withdrawal-fiat-bank': withdrawalFiatBankModule,
// 'withdrawal-fiat-card': withdrawalFiatCardModule,
// 'deposit-fiat-bank': depositFiatBankModule,
// 'deposit-fiat-card': depositFiatCardModule,

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
      factors,
      wallet,
      kyc,
      keyValue,
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
