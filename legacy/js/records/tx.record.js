import { getDateByDMY } from '../utils/dates.util'
import { feeAsset } from '../const/const'

export class TxRecord {
  constructor (record, name) {
    this._record = record
    this.name = name
    this.id = record.id

    this.date = this._getDate()
    this.state = this._record.state // TODO: resolve the state from xdr
    this.feeAsset = feeAsset
  }

  _getDate () {
    return getDateByDMY(this._record.ledger_close_time)
  }
}
