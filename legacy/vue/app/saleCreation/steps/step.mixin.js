import FileField from 'L@/vue/common/fields/FileField'
import FormMixin from 'L@/vue/common/mixins/form.mixin'

import { fileService } from 'L@/js/services/file.service'
import { i18n } from 'L@/js/i18n'
export default {
  mixins: [FormMixin],
  components: { FileField },
  props: ['schema', 'sale'],
  data: _ => ({
    i18n,
    form: {},
    documents: {}
  }),

  methods: {
    async uploadDocuments () {
      await Promise.all(Object.values(this.documents).map(document =>
        uploadSingleDocument.apply(this, [document]))
      )

      async function uploadSingleDocument (document) {
        if (document.isUploaded) return
        this.documents[document.type] =
          await fileService.uploadSingleDocument(document)
      }
    }
  }
}
