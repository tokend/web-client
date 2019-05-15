<template>
  <div class="document-manager">
    <document-manager-module
      :attached-account-id="id"
    />
  </div>
</template>

<script>
import DocumentManagerModule from '@modules/documents/document-manager'

export default {
  name: 'document-manager-page',
  components: {
    DocumentManagerModule,
  },
  props: {
    id: { type: String, required: true },
  },
}
</script>
