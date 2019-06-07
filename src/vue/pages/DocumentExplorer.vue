<template>
  <div class="document-explorer-page">
    <document-explorer-module
      :should-update.sync="shouldUpdate"
    />
  </div>
</template>

<script>
import DocumentExplorerModule from '@modules/documents/document-explorer'

const EVENTS = {
  documentUploaded: 'update:documentUploaded',
}

export default {
  name: 'document-explorer-page',
  components: {
    DocumentExplorerModule,
  },

  props: {
    documentUploaded: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      shouldUpdate: this.documentUploaded,
    }
  },

  watch: {
    shouldUpdate: function (value) {
      this.$emit(EVENTS.documentUploaded, value)
    },

    documentUploaded: function (value) {
      this.shouldUpdate = value
    },
  },
}
</script>
