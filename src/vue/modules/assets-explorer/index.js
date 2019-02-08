import AssetsExplorer from './components/Index'

import Vue from 'vue'
import Vuex from 'vuex'

import {
  mutations,
  actions,
  getters,
  state,
} from './store'
import { types } from './store/types'
import { initApi } from './api'

/**
 * @param {Wallet} wallet - SDK wallet instance to sign the requests
 *
 * @param config
 * @param config.horizonURL - horizon URL without version prefix
 * @param config.storageURL - horizon URL without version prefix
 *
 * @returns {Vue}
 */
export function initAssetsExporer (wallet, config) {
  initApi(wallet, config.horizonURL)

  const component = new Vue({
    components: { AssetsExplorer },
    render: h => h(AssetsExplorer),
    store: new Vuex.Store({
      mutations,
      actions,
      getters,
      state,
    }),
  })

  component.$store.commit(types.SET_BALANCES_OWNER_ID, wallet.accountId)

  return component
}
