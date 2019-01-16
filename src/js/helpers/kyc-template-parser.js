import { ACCOUNT_TYPES } from '@tokend/js-sdk'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { DocumentContainer } from './DocumentContainer'

export class KycTemplateParser {
  static fromFormToTemplate (form, accountType) {
    switch (accountType) {
      case ACCOUNT_TYPES.general:
        return {
          first_name: form.personal.firstName,
          last_name: form.personal.lastName,
          date_of_birth: form.personal.birthDate,
          id_expiration_date: form.personal.documentExpirationDate,
          address: {
            line_1: form.address.firstLine,
            line_2: form.address.secondLine,
            city: form.address.city,
            country: form.address.country,
            state: form.address.state,
            postal_code: form.address.postalCode
          },
          documents: {
            [DOCUMENT_TYPES.kycIdDocument]:
              form.documents.idDocument.getDetailsForSave(),
            [DOCUMENT_TYPES.kycProofOfAddress]:
              form.documents.proofDocument.getDetailsForSave(),
            [DOCUMENT_TYPES.kycSelfie]:
              form.documents.verificationPhoto.getDetailsForSave()
          }
        }
      case ACCOUNT_TYPES.syndicate:
        return {
          name: form.name,
          company: form.company,
          headquarters: form.headquarters,
          industry: form.industry,
          found_date: form.foundDate,
          team_size: form.teamSize,
          homepage: form.website
        }
    }
  }

  static fromTemplateToForm (template, accountType) {
    switch (accountType) {
      case ACCOUNT_TYPES.general:
        return {
          personal: {
            firstName: template.first_name,
            lastName: template.last_name,
            birthDate: template.date_of_birth,
            documentExpirationDate: template.id_expiration_date
          },
          address: {
            firstLine: template.address.line_1,
            secondLine: template.address.line_2,
            city: template.address.city,
            country: template.address.country,
            state: template.address.state,
            postalCode: template.address.postal_code
          },
          documents: {
            idDocument: this.wrapDocument(
              template.documents[DOCUMENT_TYPES.kycIdDocument]
            ),
            proofDocument: this.wrapDocument(
              template.documents[DOCUMENT_TYPES.kycProofOfAddress]
            ),
            verificationPhoto: this.wrapDocument(
              template.documents[DOCUMENT_TYPES.kycSelfie]
            )
          }
        }
      case ACCOUNT_TYPES.syndicate:
        return {
          name: template.name,
          company: template.company,
          headquarters: template.headquarters,
          industry: template.industry,
          foundDate: template.found_date,
          teamSize: template.team_size,
          website: template.homepage
        }
    }
  }

  static wrapDocument (document) {
    return new DocumentContainer({
      mimeType: document.mime_type,
      name: document.name,
      key: document.key
    })
  }
}
