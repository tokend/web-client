import safeGet from 'lodash/get'
import { Request } from '../../shared/wrappers/request'

export class SponsorshipRequest extends Request {
  constructor (record) {
    super(record)

    this.assetCode = safeGet(record, 'requestDetails.asset.id')
    this.amount = safeGet(record, 'requestDetails.amount')
    this.fixedFee = safeGet(record, 'requestDetails.fee.fixed')
    this.calculatedPercentFee = safeGet(
      record, 'requestDetails.fee.calculatedPercent'
    )

    this.comment = safeGet(record, 'requestDetails.creatorDetails.comment')
  }
}
