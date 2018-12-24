import store from '../index'
import { multiply, divide } from '@/js/utils/math.util'

export class PricesHelper {
  static baseToQuote (amount, fromBase, toQuote) {
    if (fromBase === toQuote) return amount
    if (!this._isValidParams(...arguments)) return 0
    const price = this._findPriceForAssetPair(fromBase, toQuote)
    if (price) {
      return multiply(amount, price)
    }
    return 0
  }

  static quoteToBase (amount, fromQuote, toBase) {
    if (!this._isValidParams(...arguments)) return 0
    if (fromQuote === toBase) return amount
    const price = this._findPriceForAssetPair(toBase, fromQuote)
    if (price) {
      return divide(amount, price)
    }
    console.warn(`
      Cannot convert amount from quote to base. Asset pair
      ${fromQuote}-${toBase} does not exist
    `)
  }

  static _findPriceForAssetPair (base, quote) {
    const assetPairs = store.getters.assetPairs
    const presentAssetPair = assetPairs.find(pair =>
      pair.quote === quote && pair.base === base
    )
    if (presentAssetPair) return presentAssetPair.current_price
    return null
  }

  static _isValidParams (amount, fromBase, toQuote) {
    if (amount === undefined || !fromBase || !toQuote) {
      return false
    }
  }
}
