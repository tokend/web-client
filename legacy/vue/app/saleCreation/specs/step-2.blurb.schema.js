import { i18n } from '../../../../js/i18n/index'
import { documentTypes } from '../../../../js/const/documents.const'

export default {
  form: {
    shortDescription: '',
    docs: {
      [documentTypes.fundLogo]: null
    }
  },
  requiredDocs: [documentTypes.fundLogo],
  rows: [
    [
      {
        'field': 'file',
        'fileType': 'image',
        'id': 'sale-blurb-image',
        'name': 'sale-blurb-image',
        'type': documentTypes.fundLogo,
        'private': false,
        'label': i18n.sale_image_label(),
        'required': true,
        'validate': 'required'
      }
    ],
    [
      {
        'field': 'textarea',
        'model': 'shortDescription',
        'name': 'blurb-description',
        'id': 'blurb-description',
        'maxlength': 250,
        'validate': 'required',
        'required': true,
        'label': i18n.sale_description_label()
      }
    ]
  ]
}
