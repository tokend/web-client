import { i18n } from '../../../../../js/i18n/index'
import { documentTypes } from '../../../../../js/const/documents.const'

export default {
  form: {
    line_1: '',
    line_2: '',
    city: '',
    country: '',
    state: '',
    postal_code: '',
    docs: {
      [documentTypes.kycProofOfAddress]: null
    }
  },
  requiredDocs: [documentTypes.kycProofOfAddress],
  rows: [
    [
      {
        'model': 'line_1',
        'name': 'line-1',
        'id': 'kyc-line-1',
        'required': true,
        'label': i18n.lbl_line_1(),
        'field': 'text',
        'validate': 'required|max:45'
      },
      {
        'model': 'line_2',
        'name': 'line-2',
        'id': 'kyc-line-2',
        'required': false,
        'label': i18n.lbl_line_2(),
        'field': 'text',
        'validate': 'max:45'
      }
    ],
    [
      {
        'model': 'city',
        'name': 'city',
        'id': 'kyc-city',
        'label': i18n.lbl_city(),
        'field': 'text',
        'required': true,
        'validate': 'required|max:30'
      },
      {
        'model': 'country',
        'name': 'country',
        'id': 'kyc-country',
        'label': i18n.lbl_country(),
        'field': 'select',
        'required': true,
        'values': 'countries',
        'validate': 'required'
      }
    ],
    [
      {
        'model': 'state',
        'name': 'state',
        'id': 'kyc-state',
        'label': i18n.lbl_state(),
        'field': 'text',
        'required': true,
        'validate': 'required|max:30'
      },
      {
        'model': 'postal_code',
        'name': 'postal-code',
        'id': 'kyc-postal-code',
        'label': i18n.lbl_postal_code(),
        'field': 'text',
        'required': true,
        'validate': 'required|max:20'
      }
    ],
    [
      {
        'name': 'file-poa',
        'id': 'kyc-file-poa',
        'label': i18n.lbl_kyc_proof(),
        'field': 'file',
        'side': 'front',
        'required': true,
        'private': true,
        'type': documentTypes.kycProofOfAddress,
        'validate': 'required'
      }
    ]
  ]
}
