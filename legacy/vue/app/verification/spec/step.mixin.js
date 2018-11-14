import FileField from '../../../common/fields/FileField'
import FormMixin from '../../../common/mixins/form.mixin'

import { fileService } from '../../../../js/services/file.service'
import { usersService } from '../../../../js/services/users.service'
import { i18n } from '../../../../js/i18n/index'
export default {
  mixins: [FormMixin],
  components: { FileField },
  props: ['schema', 'kyc', 'activeStep', 'finalStep', 'isRequestPending'],
  data: _ => ({
    i18n,
    form: {},
    documents: {},
    values: {
      countries: [],
      industries: [],
      documentTypes: []
    }
  }),

  async created () {
    const values = await usersService.loadEnums()
    this.values.countries = [ '', ...(values).data('countries') ]
    this.values.industries = [ '', ...(values).data('industry') ]
    this.values.documentTypes = [ '', ...(values).data('id_document') ]
  },

  methods: {
    async uploadDocuments () {
      await Promise.all(Object.values(this.documents).map(document =>
        uploadSingleDocument.apply(this, [document])
      ))

      async function uploadSingleDocument (document) {
        if (document.isUploaded) return
        this.documents[document.type] = await fileService.uploadSingleDocument(
          document
        )
      }
    }
  }
}
