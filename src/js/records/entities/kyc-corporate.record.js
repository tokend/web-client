import { Document } from '@tokend/js-sdk'
import { KycRecord } from './kyc.record'

export class KycCorporateRecord extends KycRecord {
  constructor (blob) {
    super(blob)
    const kyc = this._blob.valueAsObject
    const docs = kyc.documents || {}

    this.name = kyc.name
    this.company = kyc.company
    this.headquarters = kyc.headquarters
    this.industry = kyc.industry
    this.teamSize = kyc.team_size
    this.website = kyc.homepage
    this.avatar = new Document(docs.kyc_avatar)
  }
}
