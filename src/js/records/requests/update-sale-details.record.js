import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class UpdateSaleDetailsRequestRecord extends RequestRecord {
  constructor (record, details) {
    super(record)

    this.saleId = _get(record, 'details.updateSaleDetails.saleId')
    this.name = _get(record, 'details.updateSaleDetails.newDetails.name')
    this.shortDescription = _get(
      record, 'details.updateSaleDetails.newDetails.shortDescription'
    )
    this.logo = _get(record, 'details.updateSaleDetails.newDetails.logo')
    this.logoKey = _get(record, 'details.updateSaleDetails.newDetails.logo.key')
    this.logoName = _get(
      record, 'details.updateSaleDetails.newDetails.logo.name'
    )
    this.logoType = _get(
      record, 'details.updateSaleDetails.newDetails.logo.type'
    )
    this.description = _get(
      record, 'details.updateSaleDetails.newDetails.description'
    )
    this.youtubeVideoId = _get(
      record, 'details.updateSaleDetails.newDetails.youtubeVideoId'
    )
    this.returnOfInvestment = _get(
      record, 'details.updateSaleDetails.newDetails.returnOfInvestment'
    )
    this.returnOfInvestmentFrom = _get(
      record, 'details.updateSaleDetails.newDetails.returnOfInvestment.from'
    )
    this.returnOfInvestmentTo = _get(
      record, 'details.updateSaleDetails.newDetails.returnOfInvestment.to'
    )
  }
}
