import { ACCOUNT_TYPES } from '@tokend/js-sdk'

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
          documents: this.getSaveableDocuments(template.documents)
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
