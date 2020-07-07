import { KycRecord } from './kyc.record'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

export class KycCorporateRecord extends KycRecord {
  constructor (blob) {
    super(blob)
    const obj = this._blob.valueAsObject
    const docs = obj.documents || {}

    this.avatar = DocumentContainer.fromObj(docs[DOCUMENT_TYPES.kycAvatar])
  }
}
