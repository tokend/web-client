const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_ASSETS: 'SET_ASSETS',
}

const actions = {
  LOAD_BALANCES: 'LOAD_BALANCES',
  LOAD_ASSETS: 'LOAD_ASSETS',
  LOAD_SALE_BY_BASE_ASSET: 'LOAD_SALE_BY_BASE_ASSET',
}

const getters = {
  balances: 'balances',
  assets: 'assets',
  assetsInBalance: 'assetsInBalance',
  allowedToBuy: 'allowedToBuy',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
