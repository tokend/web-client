import { Request } from '../../shared/wrappers/request'

import safeGet from 'lodash/get'

export class PreIssuanceRequest extends Request {
  constructor (record) {
    super(record)

    this.assetCode = safeGet(record, 'requestDetails.asset.id')
    this.amount = safeGet(record, 'requestDetails.amount')
  }
}
