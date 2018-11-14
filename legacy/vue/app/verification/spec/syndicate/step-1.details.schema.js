import { i18n } from '../../../../../js/i18n/index'

export default {
  form: {
    name: '',
    company: '',
    headquarters: '',
    industry: '',
    found_date: null,
    team_size: '',
    homepage: ''
  },
  rows: [
    [
      {
        'model': 'name',
        'name': 'corporate-name',
        'id': 'kyc-corporate-name',
        'label': i18n.lbl_name(),
        'field': 'text',
        'required': true,
        'validate': 'required'
      },
      {
        'model': 'company',
        'name': 'corporate-company',
        'id': 'kyc-corporate-company',
        'label': i18n.lbl_company(),
        'field': 'text',
        'required': true,
        'validate': 'required'
      }
    ],
    [
      {
        'model': 'headquarters',
        'name': 'corporate-headquarters',
        'id': 'kyc-corporate-headquarters',
        'required': true,
        'label': i18n.lbl_headquarters(),
        'field': 'text',
        'validate': 'required'
      },
      {
        'model': 'industry',
        'name': 'corporate-industry',
        'id': 'kyc-corporate-industry',
        'required': true,
        'label': i18n.lbl_industry(),
        'field': 'text',
        'validate': 'required'
      }
    ],
    [
      {
        'model': 'found_date',
        'name': 'corporate-found-date',
        'label': i18n.lbl_founded(),
        'id': 'kyc-corporate-found-date',
        'field': 'date',
        'required': true,
        'validate': 'required',
        'disableAfter': new Date().toString(),
        'disableBefore': '',
        'enableTime': false
      },
      {
        'model': 'team_size',
        'name': 'corporate-team-size',
        'id': 'kyc-corporate-team-size',
        'label': i18n.lbl_team_size(),
        'field': 'text',
        'required': true,
        'validate': 'required'
      }
    ],
    [
      {
        'model': 'homepage',
        'name': 'corporate-homepage',
        'id': 'kyc-corporate-homepage',
        'label': i18n.lbl_homepage(),
        'field': 'text',
        'required': true,
        'validate': 'required'
      }
    ]
  ]
}
