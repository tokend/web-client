import safeGet from 'lodash/get'
import { MathUtil } from '@/js/utils'

import { Request } from '../../shared/wrappers/request'
import { Asset } from './asset'

export class IncomingWithdrawalRequest extends Request {
  constructor (record) {
    super(record)

    this.asset = new Asset(safeGet(record, 'requestDetails.asset') || {})
    this.amount = safeGet(record, 'requestDetails.amount')
    this.fixedFee = safeGet(record, 'requestDetails.fee.fixed')
    this.calculatedPercentFee = safeGet(
      record, 'requestDetails.fee.calculatedPercent'
    )

    this.comment = safeGet(record, 'requestDetails.creatorDetails.comment')
  }

  get totalFee () {
    return MathUtil.add(this.fixedFee, this.calculatedPercentFee)
  }
}
