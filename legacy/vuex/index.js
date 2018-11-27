import Vue from 'vue'
import Vuex from 'vuex'

import isEmptyObject from 'lodash/isEmpty'

import getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import { state } from './state/index'
import plugins from './plugins'

import { sessionStoragePlugin } from '@/vuex/plugins/session-storage'

// modules:
import account from './modules/account.module'
import tokens from './modules/tokens.module'
import transactions from './modules/transactions.module'
import user from './modules/user.module'
import wallet from './modules/wallet.module'
import offers from './modules/offers.module'
import pairs from './modules/pairs.module'
import requests from './modules/requests.module'
import sales from './modules/sales.module'
// import withdrawals from './modules/withdrawals.module'

import newAccount from '@/vuex/account.module'
import newFactors from '@/vuex/factors.module'
import newWallet from '@/vuex/wallet.module'
import newKyc from '@/vuex/kyc.module'

Vue.use(Vuex)

checkForSavedData()

const store = new Vuex.Store({
  actions,
  getters,
  mutations,
  plugins: [...plugins, sessionStoragePlugin],
  state,
  modules: {
    account,
    tokens,
    transactions,
    user,
    wallet,
    pairs,
    offers,
    requests,
    sales,
    // FIXME Temporarily making new modules namespaced to avoid collisions
    //       with the old ones
    'new-account': { ...newAccount, namespaced: true },
    'new-factors': { ...newFactors, namespaced: true },
    'new-wallet': { ...newWallet, namespaced: true },
    'new-kyc': { ...newKyc, namespaced: true }
  }
})

export default store

function checkForSavedData () {
  if (state.account && !isEmptyObject(state.account)) {
    account.state = state.account
  }
  if (state.user && !isEmptyObject(state.user)) {
    user.state = state.user
  }
  if (state.wallet && !isEmptyObject(state.wallet)) {
    wallet.state = state.wallet
  }
}
