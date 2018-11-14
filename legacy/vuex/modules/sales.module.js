import { Keypair } from 'tokend-js-sdk'
import { RecordFactory } from '../../js/records/factory'
import { vuexTypes } from '../types'
import { accountsService } from '../../js/services/accounts.service'
import { salesService } from '../../js/services/sales.service'

const state = {
  sales: [],
  starred: []
}

const mutations = {
  RESET_STARRED_SALES: (state) => {
    state.starred = []
  },
  ADD_STARRED_SALE: (state, sale) => {
    state.starred.push(sale)
  },
  SET_SALES: (state, sales) => {
    state.sales = sales
  },
  UPDATE_SALES: (state, sales) => {
    state.sales = state.sales.concat(sales)
  },
  SET_SALES_NEXT_PAGE: (state, next) => {
    state.next = next
  },
  SET_SALES_LOADED: (state) => {
    state.is_sales_loaded = true
  },
  SET_SALES_NOT_LOADED: (state) => {
    state.is_sales_loaded = false
  }
}

const actions = {
  async GET_SALES ({ commit }, filters) {
    const response = await salesService.loadSales(filters)
    commit(vuexTypes.SET_SALES, response.records.map(record =>
      RecordFactory.createSaleRecord(record))
    )
  },

  async GET_OWNERS ({ commit }, sales) {
    const owners = sales
      .map(sale => sale.owner)
      .filter(owner => Keypair.isValidPublicKey(owner))
    const details = (
      await accountsService.loadMultipleAccountDetails(owners)
    ).data('users')
    sales.forEach(sale => {
      const owner = sale.owner
      if (details[owner]) {
        sale.syndicate = details[owner].email
      }
    })
    return Promise.resolve(true)
  },

  async GET_STARRED_SALES ({ commit, dispatch, rootGetters }) {
    const tokenCodes = rootGetters.userFavorites.map(item => item.key)
    const sales =
        (await Promise.all(tokenCodes.map(code =>
          salesService.loadSaleByTokenCode(code)))
        ).map(sale => RecordFactory.createSaleRecord(sale))

    await dispatch('GET_OWNERS', sales)
    commit(vuexTypes.RESET_STARRED_SALES)
    sales.forEach(sale => commit(vuexTypes.ADD_STARRED_SALE, sale))
  }
}

const getters = {
  sales: state => state.sales,
  // saleIds: _ => StateHelper.getSaleIdWhereUSerParticipated(),
  starredSales: state => state.starred,
  salesOwned: (state, getters) => state.sales.filter(sale =>
    sale.owner === getters.accountId
  )
}

export default {
  mutations,
  actions,
  getters,
  state
}
