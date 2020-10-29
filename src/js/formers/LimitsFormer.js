import { Former } from './Former'
import { base, Document } from '@tokend/js-sdk'
import { LIMITS_REQUEST_TYPE } from '@/js/const/limits.const'

/**
 * Collects the attributes for asset-related operations
 * @class
 * @implements {Former}
 */
export class LimitsFormer extends Former {
    attrs = this.attrs || this._defaultAttrs
    get _defaultAttrs () {
      return {
        asset: '',
        dailyOut: '',
        weeklyOut: '',
        monthlyOut: '',
        annualOut: '',
        note: '',
        requestType: '',
        statsOpType: '',
        operationType: '',
      }
    }

    async buildOps () {
      await Document.uploadDocumentsDeep(this.attrs)
      return [this._buildOp()]
    }

    populate (limits) {
      this.attrs = {}
      const attrs = this.attrs

      attrs.dailyOut = limits.dailyOut
      attrs.weeklyOut = limits.weeklyOut
      attrs.monthlyOut = limits.monthlyOut
      attrs.annualOut = limits.annualOut
      attrs.asset = limits.asset
      attrs.requestType = limits.requestType
      attrs.statsOpType = limits.statsOpType
      attrs.operationType = limits.operationType
    }

    _buildOp () {
      const attrs = this.attrs
      return base.CreateManageLimitsRequestBuilder.createManageLimitsRequest({
        requestID: '0',
        creatorDetails: {
          operationType: attrs.operationType,
          statsOpType: +attrs.statsOpType,
          asset: attrs.asset,
          limits: {
            annualOut: attrs.annualOut,
            dailyOut: attrs.dailyOut,
            monthlyOut: attrs.monthlyOut,
            weeklyOut: attrs.weeklyOut,
          },
          requestType: LIMITS_REQUEST_TYPE.initial,
          note: attrs.note,
        },
      })
    }
}
