import { RequestRecord } from '../request-record'
import _get from 'lodash/get'
import { isValidJSON } from '@/js/helpers/is-valid-json'
import { STATS_OPERATION_TYPES } from '@tokend/js-sdk'

export class LimitsUpdateRequestRecord extends RequestRecord {
  constructor (record) {
    super(record)

    this.asset = _get(record, 'details.updateLimits.details.asset')
    this.operationType = _get(record, 'details.updateLimits.details.operationType')
    this.limitsRequestType = _get(record, 'details.updateLimits.details.requestType')
    this.note = _get(record, 'details.updateLimits.details.note')
    this.limits = _get(record, 'details.updateLimits.details.limits')
  }

  get operationTypeI () {
    return STATS_OPERATION_TYPES[this.operationType]
  }

  get requestedDocs () {
    let requestedDocs = []

    // user may have requested docs only when request state is 'rejected'
    if (this.state === 'rejected' && isValidJSON(this._record.rejectReason)) {
      const rejectReason = JSON.parse(this._record.rejectReason)

      if (Object.keys(rejectReason).includes('docsToUpload')) {
        requestedDocs = rejectReason.docsToUpload
        // replace document-types from 'some type' to 'some_type' to make it
        // valid and allow to translations using
        requestedDocs.forEach(item => {
          item.label = item.label.replace(/ /g, '_')
        })
      }
    }
    return requestedDocs
  }
}
