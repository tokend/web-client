<template>
  <div class="file-field">
    <div class="file-field__label">
      {{ label }}
    </div>
    <div class="file-input">
      <div
        class="file-input__file-preview"
        v-if="fileName">
        <span>
          {{ 'file-field.selected-file' | globalize }}  {{ fileName }}
        </span>
      </div>
      <div class="file-input__input-inner">
        <div class="file-input__text">
          <div class="file-input__title">
            {{ 'file-field.title' | globalize }}
          </div>
          <div class="file-input__note">{{ note }}</div>
        </div>
      </div>
      <input
        v-bind="$attrs"
        type="file"
        class="file-field__file-input"
        :accept="accept"
        @change="onChange"
      >
    </div>
  </div>
</template>

<script>
import { FileUtil } from '@/js/utils/file.util'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'
import { Bus } from '@/js/helpers/event-bus'

const MAX_FILE_MEGABYTES = 5

export default {
  name: 'file-field',
  props: {
    label: { type: String, default: '' },
    documentType: { type: String, default: 'default' },
    accept: { type: String, default: '*' },
    maxSize: { type: Number, default: MAX_FILE_MEGABYTES },
    note: { type: String, default: 'All files' }
  },
  data: _ => ({
    fileName: ''
  }),
  computed: {
    maxSizeBytes () {
      return this.maxSize * 1024 * 1024
    }
  },
  methods: {
    onChange (event) {
      let file
      try {
        file = FileUtil.getFileFromEvent(event)
      } catch (e) {
        Bus.error('file-field.file-not-selected')
        this.dropFile()
        return
      }
      if (!this.isValidFileSize(file)) {
        Bus.error('file-field.max-size-exceeded')
        this.dropFile()
        return
      }
      this.fileName = file.name
      this.$emit('input', new DocumentContainer({
        mimeType: file.type,
        type: this.documentType,
        name: file.name,
        file: file
      }))
    },
    isValidFileSize (file) {
      return file.size <= this.maxSizeBytes
    },
    dropFile () {
      this.$el.querySelector('input').value = ''
      this.fileName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import "scss/variables";

.file-field {
  display: flex;
  flex-direction: column;
}

.file-field__label {
  font-size: 1.1rem;
  color: $field-color-text;
  margin-bottom: 1.2rem;
}

.file-input {
  border: .2rem dashed $file-field-border-color;
  background-color: $file-field-background-color;
  border-radius: .4rem;
  transition: .2s;
  width: 100%;
  text-align: center;
  position: relative;
  min-height: 9.8rem;

  input[type='file'] {
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    opacity: 0;
    height: 100%;
    width: 100%;
  }

  &:hover {
    border-color: $field-color-text;
  }
}

.file-input__input-inner {
  overflow: hidden;
  margin-bottom: 1rem;
}

.file-input__text {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .file-input__title {
    color: $field-color-text;
    font-size: 1.6rem;
    margin-bottom: .8rem;
  }
}

.file-input__note {
  color: $file-field-note-color;
  font-size: 1.4rem;
  line-height: 2.2rem;
}

.file-input__file-preview {
  margin-top: 1rem;
}
</style>
