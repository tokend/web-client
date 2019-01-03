<template>
  <div class="file-field">
    <div class="file-field__label">
      {{ label }}
    </div>
    <div class="file-input">
      <div
        class="file-input__file-preview"
        v-if="fileUrl">
        <span>{{ 'file-field.selected' | globalize }}  {{ fileUrl }}</span>
      </div>
      <div class="file-input__input-inner">
        <div class="file-input__text">
          <div class="title">{{ 'file-field.title' | globalize }}</div>
          <div class="notes">
            <p class="file-input__note">{{ note }}</p>
          </div>
        </div>
      </div>
      <input
        type="file"
        class="file-field__file-input"
        :disabled="disabled"
        :accept="accept"
        @change="onChange"
      >
    </div>
  </div>
</template>

<script>
import { FileHelper } from '@/js/helpers/file.helper'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'
import { Bus } from '@/js/helpers/event-bus'

const MAX_FILE_MEGABYTES = 5

export default {
  name: 'file-field',
  props: {
    label: { type: String, default: '' },
    type: { type: String, default: 'default' },
    accept: { type: String, default: '*' },
    maxSize: { type: Number, default: MAX_FILE_MEGABYTES },
    note: { type: String, default: 'All files' },
    fileType: { type: String, default: 'default' },
    disabled: { type: Boolean, default: false }
  },
  data: _ => ({
    fileUrl: ''
  }),
  computed: {
    maxSizeBytes () {
      return this.maxSize * 1024 * 1024
    }
  },
  methods: {
    onChange (event) {
      const file = FileHelper.deriveFileFromChangeEvent(event)

      if (file) {
        if (!this.isValidFileSize(file)) return

        this.fileUrl = file.name
        this.$emit('input', new DocumentContainer({
          mimeType: file.type,
          type: this.type,
          name: file.name,
          file: file
        }))
      } else {
        this.clear()
      }
    },
    isValidFileSize (file) {
      if (file.size > this.maxSizeBytes) {
        Bus.error('errors.max-size-exceeded')
        this.clear()
        return false
      }

      return true
    },
    clear () {
      this.$el.querySelector('input').value = ''
      this.fileUrl = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import "scss/variables";
@import '~@scss/mixins';

.file-field {
  display: flex;
  flex-direction: column;
}

.file-field__label {
  font-size: 1.1rem;
  color: #3a4180;
  margin-bottom: 1.2rem;
}

.file-input {
  border: .2rem dashed #c4c8cb;
  background-color: #f5f6f9;
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

  .title {
    color: $field-color-text;
    font-size: 1.6rem;
    margin-bottom: .8rem;
  }
}

.file-input__note {
  color: #837fa1;
  font-size: 1.4rem;
  line-height: 160%;
}

.file-input__file-preview {
  margin-top: 1rem;
}
</style>
