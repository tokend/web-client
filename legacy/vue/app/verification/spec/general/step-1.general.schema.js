import { i18n } from '../../../../../js/i18n/index'
import { documentTypes } from '../../../../../js/const/documents.const'

export default {
  form: {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    id_expiration_date: '',
    docs: {
      [documentTypes.kycIdDocument]: null
    }
  },
  requiredDocs: [documentTypes.kycIdDocument],
  rows: [
    [
      {
        'model': 'first_name',
        'name': 'first-name',
        'id': 'kyc-first-name',
        'label': i18n.lbl_first_name(),
        'field': 'text',
        'required': true,
        'validate': 'required|max:30'
      }
    ],
    [
      {
        'model': 'last_name',
        'name': 'last-name',
        'id': 'kyc-last-name',
        'label': i18n.lbl_last_name(),
        'field': 'text',
        'required': true,
        'validate': 'required|max:50'
      }
    ],
    [
      {
        'model': 'date_of_birth',
        'name': 'date-of-birth',
        'label': i18n.lbl_date_of_birth(),
        'id': 'kyc-date-of-birth',
        'field': 'date',
        'required': true,
        'validate': 'required',
        'disableAfter': new Date().toString(),
        'disableBefore': '',
        'enableTime': false
      }
    ],
    [
      {
        'model': 'id_expiration_date',
        'name': 'id-exp-date',
        'id': 'kyc-id-exp-date',
        'label': i18n.lbl_id_document_exp_date(),
        'field': 'date',
        'required': true,
        'disableAfter': '',
        'disableBefore': new Date().toString(),
        'validate': 'required',
        'enableTime': false
      }
    ],
    [
      {
        'name': 'file-id',
        'id': 'kyc-file-id',
        'label': i18n.lbl_kyc_id(),
        'field': 'file',
        'side': 'front',
        'required': true,
        'private': true,
        'type': documentTypes.kycIdDocument,
        'validate': 'required'
      }
    ]
  ]
}
