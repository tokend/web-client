import { ACCOUNT_TYPES } from '@tokend/js-sdk'
import { DocumentContainer } from './DocumentContainer'

export class KycTemplateParser {
  static fromTemplate (template, type) {
    switch (type) {
      case ACCOUNT_TYPES.general:
        return {
          first_name: template.personal.firstName,
          last_name: template.personal.lastName,
          date_of_birth: template.personal.birthDate,
          id_expiration_date: template.personal.documentExpirationDate,
          address: {
            line_1: template.address.firstLine,
            line_2: template.address.secondLine,
            city: template.address.city,
            country: template.address.country,
            state: template.address.state,
            postal_code: template.address.postalCode
          },
          documents: {
            kyc_id_document: template.documents.idDocument
              .getDetailsForSave(),
            kyc_poa: template.documents.proofDocument
              .getDetailsForSave(),
            kyc_selfie: template.documents.verificationPhoto
              .getDetailsForSave()
          }
        }
      case ACCOUNT_TYPES.syndicate:
        return {
          name: template.name,
          company: template.company,
          headquarters: template.headquarters,
          industry: template.industry,
          found_date: template.foundDate,
          team_size: template.teamSize,
          homepage: template.website
        }
    }
  }

  static toTemplate (form, type) {
    switch (type) {
      case ACCOUNT_TYPES.general:
        return {
          personal: {
            firstName: form.first_name,
            lastName: form.last_name,
            birthDate: form.date_of_birth,
            documentExpirationDate: form.id_expiration_date
          },
          address: {
            firstLine: form.address.line_1,
            secondLine: form.address.line_2,
            city: form.address.city,
            country: form.address.country,
            state: form.address.state,
            postalCode: form.address.postal_code
          },
          documents: {
            idDocument: new DocumentContainer({
              mimeType: form.documents.kyc_id_document.mime_type,
              name: form.documents.kyc_id_document.name,
              key: form.documents.kyc_id_document.key
            }),
            proofDocument: new DocumentContainer({
              mimeType: form.documents.kyc_poa.mime_type,
              name: form.documents.kyc_poa.name,
              key: form.documents.kyc_poa.key
            }),
            verificationPhoto: new DocumentContainer({
              mimeType: form.documents.kyc_selfie.mime_type,
              name: form.documents.kyc_selfie.name,
              key: form.documents.kyc_selfie.key
            })
          }
        }
      case ACCOUNT_TYPES.syndicate:
        return {
          name: form.name,
          company: form.company,
          headquarters: form.headquarters,
          industry: form.industry,
          foundDate: form.found_date,
          teamSize: form.team_size,
          website: form.homepage
        }
    }
  }

  static getSaveableDocuments (documents) {
    const result = {}
    for (const [type, doc] of Object.entries(documents)) {
      result[type] = doc.getDetailsForSave()
    }
    return result
  }
}
