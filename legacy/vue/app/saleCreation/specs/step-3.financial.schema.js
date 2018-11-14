import { i18n } from '../../../../js/i18n/index'

export default {
  form: {
    youtubeId: '',
    description: ''
  },
  rows: [
    [
      {
        'field': 'text',
        'model': 'youtubeId',
        'name': 'video-description',
        'id': 'video-description',
        'validate': 'required',
        'required': true,
        'label': i18n.sale_description_label()
      }
    ],
    [
      {
        'field': 'textarea',
        'model': 'description',
        'name': 'project-information',
        'id': 'project-information',
        'validate': 'required',
        'required': true,
        'label': i18n.sale_project_information()
      }
    ]
  ]
}
