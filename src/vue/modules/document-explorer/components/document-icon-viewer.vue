<template>
  <p class="document-icon-viewer">
    <i :class="iconClassName" />
  </p>
</template>

<script>
import { Document } from '../wrappers/document'

export default {
  name: 'document-icon-viewer',
  props: {
    document: { type: Document, required: true },
  },

  computed: {
    iconClassName () {
      const type = this.document.mimeType

      if (type.includes('image/')) {
        return 'mdi mdi-image'
      } else if (type.includes('/pdf')) {
        return 'mdi mdi-file-pdf-box'
      } else {
        return 'mdi mdi-file-document-box'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

// TODO: colors
.document-icon-viewer {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-document-icon-background;
  color: $col-document-icon-text;
}
</style>
