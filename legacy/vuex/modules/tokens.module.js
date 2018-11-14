import { vuexTypes } from '../types'

import { tokensService } from '../../js/services/tokens.service'
import { RecordFactory } from '../../js/records/factory'
import { StateHelper } from '../helpers/state.helper'

export const state = {
  tokens: [],
  userOwnedTokens: [],
  acquired_tokens: []
}

export const mutations = {
  SET_ALL_TOKENS: (state, tokens) => {
    state.tokens = tokens
  },
  SET_USER_OWNED_TOKENS: (state, tokens) => {
    state.user_tokens = tokens
  },
  SET_USER_ACQUIRED_TOKENS: (state, tokens) => {
    state.acquired_tokens = tokens
  }
}

export const actions = {
  async GET_ALL_TOKENS ({ commit }) {
    commit(vuexTypes.SET_ALL_TOKENS, (
      await tokensService.loadTokens())
      .map(record => RecordFactory.createTokenRecord(record))
    )
  }
}

export const getters = {
  tokens: state => state.tokens.sort((a, b) => a.code > b.code ? 1 : -1),
  walletTokens: state => state.tokens.filter(token => token.isWalletToken),
  userOwnedTokens: state => state.userOwnedTokens,
  userAcquiredTokens: _ => StateHelper.deriveTokensFromBalancesDetails(),
  userWalletTokens: _ =>
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
