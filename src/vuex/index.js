import Vue from 'vue'
import Vuex from 'vuex'

import account from './account.module'
import factors from './factors.module'
import wallet from './wallet.module'
import kyc from './kyc.module'
import keyValue from './key-value.module'

import { movementsHistoryModule } from '@/vue/modules/movements-history/store'
import { issuanceExplorerModule } from '@/vue/modules/issuance-explorer/store'
import { feesModule } from '@/vue/modules/fees/store'
import { documentSignersManager } from '@/vue/modules/documents/document-manager/modules/signers-manager/store'

import { vuexTypes } from '@/vuex/types'
import { sessionStoragePlugin } from './plugins/session-storage'

import _isEmpty from 'lodash/isEmpty'

Vue.use(Vuex)

export const rootModule = {
  actions: {},
  mutations: {
    // These mutations are being subscribed by plugins
    [vuexTypes.POP_STATE] () {},
    [vuexTypes.CLEAR_STATE] () {},
  },
  getters: {
    [vuexTypes.isLoggedIn]: (_, getters) => !_isEmpty(
      getters[vuexTypes.account]
    ),
  },
  state: {},
}

const store = new Vuex.Store({
  ...rootModule,
  modules: {
    account,
    factors,
    wallet,
    kyc,
    keyValue,
    // namespaced local modules (used by a specific set of components)
    'document-signers-manager': documentSignersManager,
    'movements-history': movementsHistoryModule,
    'issuance-explorer': issuanceExplorerModule,
    'fees': feesModule,
  },
  plugins: [sessionStoragePlugin],
})

store.commit(vuexTypes.POP_STATE)

export { store }
export { vuexTypes } from './types'
