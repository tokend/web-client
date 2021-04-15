import _get from 'lodash/get'

export class CampaignRecord {
  constructor (record) {
    this._record = record

    this.name = _get(record, 'name', '')
    this.description = _get(record, 'description', '')
    this.raisingAmount = _get(record, 'raisingAmount', '')
    this.amountOfShapes = _get(record, 'amountOfShapes', '')
    this.logo = _get(record, 'logo', '')
    this.invested = 740000
  }
}
