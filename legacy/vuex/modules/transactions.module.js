import { accountsService } from 'L@/js/services/accounts.service'
import { transactionsService } from 'L@/js/services/transactions.service'
import { parseTransaction } from 'L@/js/parsers/tx.parser'
import { Paginator } from 'L@/js/helpers/paginator'
import { vuexTypes } from '../types'
import { Keypair } from 'tokend-js-sdk'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'

const state = {
  lists: {},
  isInitialized: false
}

export const mutations = {
  UPDATE_TX_LIST (state, tokenCodes) {
    tokenCodes.forEach(code => {
      state.lists[code] = new Paginator({
        recordWrp: (record) => parseTransaction(record, code)
      })
    })
  },

  UPDATE_TX_LIST_ITEM (state, { code, paginator }) {
    const lists = cloneDeep(state.lists)
    lists[code] = paginator
    state.lists = lists
  },

  SET_TX_LIST_INITIALIZED (state) {
    state.isInitialized = true
  }
}

export const actions = {
  INIT_TX_LIST ({ commit, rootGetters }) {
    const tokenCodes = Object.keys(rootGetters.accountBalances)
    commit(vuexTypes.UPDATE_TX_LIST, tokenCodes)
    commit(vuexTypes.SET_TX_LIST_INITIALIZED)
  },

  async GET_TX_LIST ({ state, dispatch, commit }, tokenCode) {
    if (!state.isInitialized) dispatch(vuexTypes.INIT_TX_LIST)

    let paginator
    if (state.lists[tokenCode]) {
      paginator = state.lists[tokenCode]
    } else {
      state.lists[tokenCode] = new Paginator({
        recordWrp: record => parseTransaction(record, tokenCode)
      })
      paginator = state.lists[tokenCode]
    }

    paginator.attachInitLoader(() =>
      transactionsService.loadTransactionHistory(tokenCode)
    )

    await paginator.init()
    commit(vuexTypes.UPDATE_TX_LIST_ITEM, { tokenCode, paginator })
  },

  async NEXT_TX_LIST ({ state, commit, dispatch }, tokenCode) {
    const paginator = state.lists[tokenCode]
    await paginator.next()
    commit(vuexTypes.UPDATE_TX_LIST_ITEM, paginator)
  },

  async UPDATE_TX_COUNTERPARTIES ({ commit }, transactions) {
    const counterparties = transactions
      .map(transaction => transaction.counterparty)
      .filter(counterparty => Keypair.isValidPublicKey(counterparty))

    const details =
      (await accountsService.loadMultipleAccountDetails(counterparties))
        .data('users')

    transactions.forEach(transaction => {
      transaction.counterparty =
        get(details, `[${transaction.counterparty}].email`) ||
        transaction.counterparty
    })
  }
}

export const getters = {
  transactions: state => state.lists
}

export default {
  actions,
  getters,
  mutations,
  state
}
