<template>
  <form class="app-form" @submit.prevent="submit">
    <h3 class="app__form-subheading limits-documents-uploader__form-heading">
      Requirements
    </h3>
    <template v-for="(doc, d) in request.requestedDocs">
      <div
        class="app__form-row limits-documents-uploader__document"
        :key="`limits-documents-uploader-document-${d}`"
      >
        <div class="limits-documents-uploader__document-title">
          <span>Document type:</span>
          <span>
            {{ DOCUMENT_TYPES_TRANSLATIONS_ID[doc.label] | globalize }}
          </span>
        </div>
        <div
          class="limits-documents-uploader__document-title"
          v-if="doc.description"
        >
          <span>Note</span>
          <span> {{ doc.description }} </span>
        </div>
        <div class="app__form-field">
          <file-field
            v-model="form.documents[doc.label]"
            :note="'verification-form.file-type-note' | globalize"
            accept="image/*, .pdf"
            :document-type="doc.label"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
    </template>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { DOCUMENT_TYPES_TRANSLATIONS_ID } from '@/js/const/document-types.const'

export default {
  name: 'limits-documents-uploader-form',
  components: {
  },
  mixins: [FormMixin],
  props: {
    request: { type: Object, required: true, default: () => ({}) },
  },
  data: () => ({
    DOCUMENT_TYPES_TRANSLATIONS_ID,
    form: {
      documents: {},
    },
  }),
  computed: {
  },
  created () {
  },
  methods: {
    submit () {
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.limits-documents-uploader__form-heading {
  margin-bottom: 3.2rem;
}

.limits-documents-uploader__document {
  flex-direction: column;
}

.limits-documents-uploader__document-title {
  span:first-child {
    margin-right: .2rem;
  }
}
</style>
