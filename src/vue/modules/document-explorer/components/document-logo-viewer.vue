<template>
  <p class="document-logo-viewer">
    <i :class="iconClassName" />
  </p>
</template>

<script>
import { Document } from '../wrappers/document'

export default {
  name: 'document-logo-viewer',
  props: {
    document: { type: Document, required: true },
  },

  computed: {
    iconClassName () {
      const type = this.document.mimeType

      if (type.includes('image/')) {
        return 'mdi mdi-image'
      } else if (type.includes('/pdf')) {
        return 'mdi mdi-pdf-box'
      } else {
        return 'mdi mdi-file-document-box'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

// TODO: colors
.document-logo-viewer {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-asset-logo-background;
  color: $col-asset-logo-text;
}
</style>
