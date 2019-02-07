import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class LimitsUpdateRequestRecord extends RequestRecord {
  constructor (record) {
    super(record)

    this.requestType = _get(record, 'details.limitsUpdate.details.requestType')
    this.asset = _get(record, 'details.limitsUpdate.details.asset')
  }

  isValidJSONString (str) {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }

  get requestedDocs () {
    let requestedDocs = []

    // user may have requested docs only when request state is 'rejected'
    // eslint-disable-next-line
    if (this.state === 'rejected' && this.isValidJSONString(this._record.rejectReason)) {
      const rejectReason = JSON.parse(this._record.rejectReason)

      if (Object.keys(rejectReason).includes('docsToUpload')) {
        requestedDocs = rejectReason.docsToUpload
        // replace document-types from 'some type' to 'some_type' to allow
        // translations using
        requestedDocs.forEach(item => {
          item.label = item.label.replace(/ /g, '_')
        })
      }
    }
    return requestedDocs
  }
}
