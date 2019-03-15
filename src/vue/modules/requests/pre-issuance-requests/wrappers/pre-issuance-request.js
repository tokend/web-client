import { Request } from '../../shared/wrappers/request'

import saveGet from 'lodash/get'

export class PreIssuanceRequest extends Request {
  constructor (record) {
    super(record)

    this.assetCode = saveGet(record, 'requestDetails.asset.id')
    this.amount = saveGet(record, 'requestDetails.amount')
  }
}
