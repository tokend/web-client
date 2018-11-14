import store from '../index'

/**
 * Finds sale for provided token in store if exists
 * @param {string} code - token code for sale to find
 * @return {@link SaleRecord | undefined}
 */
export function findSaleIfExists (code) {
  const sales = store.getters.sales
  return sales.find(sale => sale.baseAsset === code)
}
