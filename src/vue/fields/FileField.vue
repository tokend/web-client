<template>
  <div class="file-field">
    <div class="file-field__label">
      {{ label }}
    </div>
    <div
      class="file-input"
      :class="{
        'file-input--disabled': $attrs.disabled,
        'file-input--highlighted': isFileDragged
      }"
    >
      <template v-if="document">
        <button
          class="app__button-icon file-field__reset-btn"
          type="button"
          :disabled="$attrs.disabled"
          @click="resetField"
        >
          <i class="mdi mdi-close file-field__reset-icon" />
        </button>

        <div
          v-if="url && isImageSelected"
          class="file-field__img-preview-wrp"
        >
          <img class="file-field__img-preview" :src="url">
        </div>

        <div v-else class="file-field__icon-preview-wrp">
          <i class="mdi mdi-file file-field__icon-preview" />
        </div>

        <div class="file-input__file-preview">
          {{ 'file-field.selected-file' | globalize({ name: document.name }) }}
        </div>
      </template>

      <div class="file-input__input-inner">
        <i class="mdi mdi-upload file-field__upload-icon" />
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
      <!--
        title is set to empty string to avoid ambiguity concerning
        the selected file. When we set document programmatically
        (e.g. when dispaying files uploaded before), file input title
        will be `No file chosen`, cause JavaScript doesn't allow to
        select the file from the code.
      -->
      <input
        v-bind="$attrs"
        type="file"
        class="file-field__file-input"
        :accept="accept"
        title=""
        @change="onChange"
        @dragenter="highlightField"
        @dragleave="isFileDragged = false"
        @drop="isFileDragged = false"
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

import config from '@/config'

const MAX_FILE_MEGABYTES = 5
const DEFAULT_FILE_TYPES = ['jpg', 'png']

export default {
  name: 'file-field',
  props: {
    value: { type: Object, default: null },
    label: { type: String, default: '' },
    documentType: { type: String, default: 'default' },
    accept: { type: Array, default: _ => DEFAULT_FILE_TYPES },
    maxSize: { type: Number, default: MAX_FILE_MEGABYTES },
    note: { type: String, default: 'All files' },
    errorMessage: { type: String, default: undefined },
  },
  data: _ => ({
    document: null,
    isFileDragged: false,
    url: ''
  }),
  computed: {
    maxSizeBytes () {
      return this.maxSize * 1024 * 1024
    },
    isImageSelected () {
      return this.document.mimeType.includes('image')
    }
  },
  watch: {
    'value': function (value) {
      this.document = value
    },
  },
  created () {
    if (this.value instanceof DocumentContainer) {
      this.document = this.value
      this.url = `${config.FILE_STORAGE}/${this.value.key}`
    }
  },
  methods: {
    highlightField (event) {
      this.isFileDragged = true
    },
    resetField () {
      this.document = null
      this.url = ''
      this.$emit('input', this.document)
    },
    async onChange (event) {
      let file
      try {
        file = FileUtil.getFileFromEvent(event)
      } catch (e) {
        if (e instanceof FileNotPresentInEventError) {
          this.resetField()
          return
        }
        ErrorHandler.process(e)
      }
      if (this.isValidFileSize(file)) {
        this.url = await FileUtil.getDataUrl(file)
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
@import "~@scss/mixins";

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

.file-input--highlighted {
  border-color: black;
  background-color: white;
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
  color: $file-field-note-color;
  font-size: 1.2rem;
}

.file-field__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}

.file-field__upload-icon {
  color: $file-field-note-color;
  font-size: 4.2rem;
}

.file-field__img-preview-wrp {
  margin-top: 2rem;
  width: 100%;
}

.file-field__img-preview {
  padding: 0rem 5rem;
  object-fit: contain;
  width: 100%;
  height: 15rem;
  margin: auto;
}

.file-field__reset-btn {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  min-width: 3rem;
  min-height: 3rem;
  margin: 0.6rem;
}

.file-field__reset-icon {
  font-size: 2.4rem;

  &:before {
    font-weight: bold;
    vertical-align: middle;
  }
}

.file-field__icon-preview {
  font-size: 8rem;
}
</style>
