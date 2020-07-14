import { KycRecord } from './kyc.record'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

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
    this.avatar = DocumentContainer.fromObj(docs.kyc_avatar)
  }
}
