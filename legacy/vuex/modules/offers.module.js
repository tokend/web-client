import { OffersService } from '../../js/services/offer.service'
import { RecordFactory } from '../../js/records/factory'
import { vuexTypes } from '../types'
import { Paginator } from '../../js/helpers/paginator'

const state = {
  saleOffers: [],

  buy: [],
  sell: [],

  trades: new Paginator({
    recordWrp: RecordFactory.createTradeRecord.bind(RecordFactory)
  }),

  userOffers: new Paginator({
    recordWrp: RecordFactory.createOfferRecord.bind(RecordFactory)
  }),

  userSaleOffers: {}
}

const mutations = {
  SET_SALE_OFFERS: (state, offers) => {
    state.saleOffers = offers
  },
  SET_USER_SALE_OFFERS: (state, payload) => {
    const offers = payload.offers
    const id = payload.id
    state.userSaleOffers[id] = offers
  },
  SET_SELL_OFFERS: (state, offers) => {
    state.sell = offers
  },
  SET_BUY_OFFERS: (state, offers) => {
    state.buy = offers
  }
}

const actions = {
  async GET_SALE_OFFERS ({ commit }, saleId) {
    const offersService = new OffersService({})
    const response = await offersService.loadUserSaleOffers(saleId)
    const offers = response.records.map(record =>
      RecordFactory.createOfferRecord(record)
    )
    commit(vuexTypes.SET_SALE_OFFERS, offers)
  },

  /**
   * Loads sale offers for all provided identifiers
   * @async
   * @param {function} commit - default vuex callback
   * @param {Array<string|number>} ids - id of the sale
   */
  async GET_USER_SALE_OFFERS ({ commit }, ids) {
    for (const id of ids) {
      const offersService = new OffersService({})
      const response = await offersService.loadUserSaleOffers(id)
      const offers = response.records.map(record =>
        RecordFactory.createOfferRecord(record)
      )
      commit(vuexTypes.SET_USER_SALE_OFFERS, { id, offers })
    }
  },
  /**
   * @async
   *
   * @param {function} commit - default vuex callback
   *
   * @param {object} pair
   * @param {string} pair.base
   * @param {string} pair.quote
   */
  async GET_BUY_OFFERS ({ commit }, pair) {
    const offersService = new OffersService({})
    const response = await offersService.loadTradeOffers({
      ...pair,
      isBuy: true
    })
    const offers = response.records.map(record =>
      RecordFactory.createOfferRecord(record)
    )
    commit(vuexTypes.SET_BUY_OFFERS, offers)
  },

  /**
   * @async
   *
   * @param {function} commit - default vuex callback
   *
   * @param {object} pair
   * @param {string} pair.base
   * @param {string} pair.quote
   */
  async GET_SELL_OFFERS ({ commit }, pair) {
    const offersService = new OffersService({})
    const response = await offersService.loadTradeOffers({
      ...pair, isBuy: false
    })
    const offers = response.records.map(record =>
      RecordFactory.createOfferRecord(record)
    )
    commit(vuexTypes.SET_SELL_OFFERS, offers)
  },

  GET_SM_OFFERS ({ dispatch }, pair) {
    dispatch(vuexTypes.GET_BUY_OFFERS, pair)
    dispatch(vuexTypes.GET_SELL_OFFERS, pair)
  },

  GET_USER_OFFERS ({ state }, pair) {
    const offersService = new OffersService({})
    state.userOffers.attachInitLoader(() => offersService.loadUserOffers(pair))
    return state.userOffers.init()
  },

  NEXT_USER_OFFERS ({ state }) {
    return state.userOffers.next()
  },

  GET_TRADES ({ state }, pair) {
    const offersService = new OffersService({})
    state.trades.attachInitLoader(
      offersService.loadCompletedTrades.bind(offersService)
    )
    return state.trades.init(pair)
  },

  NEXT_TRADES ({ state }) {
    return state.trades.next()
  }
}

const getters = {
  saleOffers: state => state.saleOffers,
  buyOffers: state => state.buy,
  sellOffers: state => state.sell,
  trades: state => state.trades.records,
  isTradesLoaded: state => state.trades.isLoaded,
  userOffers: state => state.userOffers.records,
  isUserOffersLoaded: state => state.userOffers.isLoaded,

  userSaleOffers: state => id => state.userSaleOffers[id] || [],
  userSaleOffersByTokenCode: state => code => {
    let offers = []
    Object.values(state.userSaleOffers)
      .forEach(saleOffers => {
        for (const offer of saleOffers) {
          if (offer.baseAssetCode === code) {
            offers.push(offer)
          }
        }
      })
    return offers
  }
}

export default {
  actions,
  getters,
  mutations,
  state
}
