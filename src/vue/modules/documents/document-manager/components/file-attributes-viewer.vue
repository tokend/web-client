<template>
  <div class="file-attributes-viewer">
    <div class="file-attributes-viewer__clipboard-field-wrp">
      <clipboard-field
        :value="metadata.fileHash"
        :label="'document-manager.file-hash-lbl' | globalize"
      />
    </div>

    <div class="file-attributes-viewer__inner">
      <div class="file-attributes-viewer__file-icon-wrp">
        <file-icon :mime="metadata.fileMimeType" />
      </div>
      <div class="file-attributes-viewer__attributes-wrp">
        <a
          :download="metadata.fileName"
          :href="downloadLink"
          target="_blank"
          class="file-attributes-viewer__download-link"
        >
          {{ metadata.fileName }}
        </a>
        <p class="file-attributes-viewer__attribute">
          {{ metadata.fileKey }}
        </p>
        <p class="file-attributes-viewer__attribute">
          {{ metadata.fileMimeType }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import FileIcon from './file-icon'

import { Metadata } from '../wrappers/metadata'
import ClipboardField from '@/vue/fields/ClipboardField'

export default {
  name: 'file-attributes-viewer',
  components: {
    FileIcon,
    ClipboardField,
  },
  props: {
    metadata: {
      type: Metadata,
      required: true,
    },
    downloadLink: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.file-attributes-viewer__inner {
  display: flex;
  align-items: center;
}

.file-attributes-viewer__attribute {
  line-height: 2.5rem;
  max-width: 30rem;
  text-overflow: ellipsis;
  overflow: hidden;
}

.file-attributes-viewer__file-icon-wrp {
  margin-right: 2rem;
}

.file-attributes-viewer__clipboard-field-wrp {
  margin-bottom: 2rem;
}

</style>
