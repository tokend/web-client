import { userTypes } from '../../../../js/const/const'
import { wrapDocuments } from '../../../../js/helpers/DocumentContainer'
export class KycTemplateParser {
  static fromTemplate (template, type) {
    switch (type) {
      case userTypes.general:
        return {
          first_name: template.first_name,
          last_name: template.last_name,
          line_1: template.address.line_1,
          line_2: template.address.line_2,
          city: template.address.city,
          country: template.address.country,
          state: template.address.state,
          postal_code: template.address.postal_code,
          id_expiration_date: template.id_expiration_date,
          date_of_birth: template.date_of_birth,
          documents: wrapDocuments(template.documents)
        }
      case userTypes.syndicate:
        return {
          name: template.name,
          company: template.company,
          headquarters: template.headquarters,
          industry: template.industry,
          found_date: template.found_date,
          team_size: template.team_size,
          homepage: template.homepage,
          documents: wrapDocuments(template.documents)
        }
    }
  }

  static toTemplate (form, type) {
    switch (type) {
      case userTypes.general:
        return {
          first_name: form.first_name,
          last_name: form.last_name,
          date_of_birth: form.date_of_birth,
          id_expiration_date: form.id_expiration_date,
          address: {
            line_1: form.line_1,
            line_2: form.line_2,
            city: form.city,
            country: form.country,
            state: form.state,
            postal_code: form.postal_code
          }
        }
      case userTypes.syndicate:
        return {
          name: form.name,
          company: form.company,
          headquarters: form.headquarters,
          industry: form.industry,
          found_date: form.found_date,
          team_size: form.team_size,
          homepage: form.homepage
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
