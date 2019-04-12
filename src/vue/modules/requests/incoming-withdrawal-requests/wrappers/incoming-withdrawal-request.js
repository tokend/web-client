import safeGet from 'lodash/get'
import { Request } from '../../shared/wrappers/request'
import { MathUtil } from '@/js/utils'

export class IncomingWithdrawalRequest extends Request {
  constructor (record) {
    super(record)

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
