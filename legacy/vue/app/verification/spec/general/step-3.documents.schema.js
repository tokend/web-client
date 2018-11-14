import { i18n } from '../../../../../js/i18n/index'
import { documentTypes } from '../../../../../js/const/documents.const'

export default {
  form: {
    docs: {
      [documentTypes.kycSelfie]: null
    }
  },
  requiredDocs: [documentTypes.kycSelfie],
  rows: [
    [
      {
        'name': 'account-file-photo',
        'id': 'kyc-file-photo',
        'label': i18n.lbl_kyc_selfie(),
        'field': 'file',
        'side': 'front',
        'required': true,
        'private': true,
        'type': documentTypes.kycSelfie,
        'validate': 'required'
      }
    ]
  ]
}
