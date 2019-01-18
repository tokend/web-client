<template>
  <div class="file-field">
    <div class="file-field__label">
      {{ label }}
    </div>
    <div
      class="file-input"
      :class="{ 'file-input--disabled': $attrs.disabled }"
    >
      <div
        class="file-input__file-preview"
        v-if="document"
      >
        {{ 'file-field.selected-file' | globalize({ name: document.name }) }}
      </div>
      <div class="file-input__input-inner">
        <div class="file-input__text">
          <p class="file-input__title">
            <template v-if="$attrs.disabled">
              {{ 'file-field.disabled-msg' | globalize }}
            </template>
            <template v-else>
              {{ 'file-field.title' | globalize }}
            </template>
          </p>
          <div class="file-input__note">
            {{ note }}
          </div>
        </div>
      </div>
      <input
        v-bind="$attrs"
        type="file"
        class="file-field__file-input"
        :accept="accept"
        title=""
        @change="onChange"
      >
    </div>
    <div
      class="file-field__err-mes"
      v-if="errorMessage"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { FileUtil, FileNotPresentInEventError } from '@/js/utils/file.util'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const MAX_FILE_MEGABYTES = 5

export default {
  name: 'file-field',
  props: {
    value: { type: Object, default: null },
    label: { type: String, default: '' },
    documentType: { type: String, default: 'default' },
    accept: { type: String, default: '*' },
    maxSize: { type: Number, default: MAX_FILE_MEGABYTES },
    note: { type: String, default: 'All files' },
    errorMessage: { type: String, default: undefined },
  },
  data: _ => ({
    document: null,
  }),
  computed: {
    maxSizeBytes () {
      return this.maxSize * 1024 * 1024
    },
  },
  watch: {
    'value': function (value) {
      this.document = value
    },
  },
  created () {
    if (this.value) {
      this.document = this.value
    }
  },
  methods: {
    onChange (event) {
      let file
      try {
        file = FileUtil.getFileFromEvent(event)
      } catch (e) {
        if (e instanceof FileNotPresentInEventError) {
          Bus.error('file-field.file-not-uploaded-err')
          this.document = null
          this.$emit('input', this.document)
          return
        }
        console.error(e)
        ErrorHandler.process(e)
      }
      if (this.isValidFileSize(file)) {
        this.document = new DocumentContainer({
          mimeType: file.type,
          type: this.documentType,
          name: file.name,
          file: file,
        })
        this.$emit('input', this.document)
      } else {
        Bus.error('file-field.max-size-exceeded-err')
        this.dropFile()
      }
    },
    isValidFileSize (file) {
      return file.size <= this.maxSizeBytes
    },
    dropFile () {
      this.$el.querySelector('input').value = ''
    },
  },
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

  &:not(.file-input--disabled):hover {
    border-color: $field-color-text;
  }
}

.file-input--disabled {
  filter: grayscale(100%);

  input[type='file'] {
    cursor: default;
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

.file-field__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}
</style>
