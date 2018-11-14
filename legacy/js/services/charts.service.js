import { Service } from './service'

export class ChartsService extends Service {
  /**
   * Loads chart with data for specified token
   *
   * @param {string} tokenCode - token code to load charts for
   * @return {Promise <ResponseBuilder>}
   */
  loadChartsForToken (tokenCode) {
    return this._apiRequestBuilder
      .charts()
      .token(tokenCode)
      .get()
  }

  /**
   * Loads chart with data for specified base/quote token pair
   *
   * @param {string} baseToken - base token code
   * @param {string} quoteToken - quote token code
   * @return {Promise <ResponseBuilder>}
   */
  loadChartsForTokenPair (baseToken, quoteToken) {
    return this.loadChartsForToken(`${baseToken}-${quoteToken}`)
  }
}

export const chartsService = new ChartsService()
