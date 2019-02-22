import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class UpdateSaleDetailsRequestRecord extends RequestRecord {
  constructor (record, details) {
    super(record)

    this.saleId = _get(record, 'details.updateSaleDetails.saleId')
    this.name = _get(record, 'details.updateSaleDetails.creatorDetails.name')
    this.shortDescription = _get(
      record, 'details.updateSaleDetails.creatorDetails.shortDescription'
    )
    this.logo = _get(record, 'details.updateSaleDetails.creatorDetails.logo')
    this.logoKey = _get(record, 'details.updateSaleDetails.creatorDetails.logo.key')
    this.logoName = _get(
      record, 'details.updateSaleDetails.creatorDetails.logo.name'
    )
    this.logoType = _get(
      record, 'details.updateSaleDetails.creatorDetails.logo.type'
    )
    this.description = _get(
      record, 'details.updateSaleDetails.creatorDetails.description'
    )
    this.youtubeVideoId = _get(
      record, 'details.updateSaleDetails.creatorDetails.youtubeVideoId'
    )
    this.returnOfInvestment = _get(
      record, 'details.updateSaleDetails.creatorDetails.returnOfInvestment'
    )
    this.returnOfInvestmentFrom = _get(
      record, 'details.updateSaleDetails.creatorDetails.returnOfInvestment.from'
    )
    this.returnOfInvestmentTo = _get(
      record, 'details.updateSaleDetails.creatorDetails.returnOfInvestment.to'
    )
  }
}
