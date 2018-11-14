import { ResponseBuilder } from '../response_builder'

import { xdr } from 'tokend-js-sdk'

export class TransactionResponseBuilder extends ResponseBuilder {
  constructor (response) {
    super(response)
    this._parsedData = response
  }

  result () {
    const resultXDR = this._parsedData.result_xdr
    /* eslint-disable */
    return xdr.TransactionResult.fromXDR(new Buffer(resultXDR, 'base64'))
    /* eslint-enable */
  }

  requestID () {
    return this
      .result()
      .result()
      .results()[0]
      .tr()
      .manageAssetResult()
      .success()
      .requestId()
      .toString()
  }
}
