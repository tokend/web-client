import { vuexTypes } from './types'

import { Sdk } from '../sdk'
import { RecordFactory } from '../js/records/entities/factory'
import { StateHelper } from 'L@/vuex/helpers/state.helper'

export const state = {
  tokens: [],
  userOwnedTokens: [],
  acquired_tokens: []
}

export const mutations = {
  [vuexTypes.SET_ALL_TOKENS]: (state, tokens) => {
    state.tokens = tokens
  },
  [vuexTypes.SET_USER_OWNED_TOKENS]: (state, tokens) => {
    state.user_tokens = tokens
  },
  [vuexTypes.SET_USER_ACQUIRED_TOKENS]: (state, tokens) => {
    state.acquired_tokens = tokens
  }
}

export const actions = {
  async [vuexTypes.GET_ALL_TOKENS] ({ commit }) {
    commit(vuexTypes.SET_ALL_TOKENS, (
      await Sdk.horizon.assets.getAll()).data
      .map(record => RecordFactory.createTokenRecord(record))
    )
  }
}

export const getters = {
  [vuexTypes.tokens]: state => state.tokens
    .sort((a, b) => a.code > b.code ? 1 : -1),
  [vuexTypes.walletTokens]: state => state.tokens
    .filter(token => token.isWalletToken),
  [vuexTypes.userOwnedTokens]: state => state.userOwnedTokens,
  [vuexTypes.userAcquiredTokens]: _ => StateHelper
    .deriveTokensFromBalancesDetails(),
  [vuexTypes.userWalletTokens]: _ =>
    StateHelper.deriveTokensFromBalancesDetails(token => token.isWalletToken),
  userTransferableTokens: _ =>
    StateHelper.deriveTokensFromBalancesDetails(token => token.isTransferable),
  userWithdrawableTokens: _ =>
    StateHelper.deriveTokensFromBalancesDetails(token => token.isWithdrawable)
}

export default {
  actions,
  getters,
  mutations,
  state
}
