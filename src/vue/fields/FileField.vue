<template>
  <div class="file-field">
    <div
      class="file-field__label"
      :class="{ 'file-field__label--disabled': $attrs.disabled }"
    >
      {{ label }}
    </div>
    <div
      class="file-field__content"
      :class="{
        'file-field__content--disabled': $attrs.disabled,
        'file-field__content--highlighted': isFileDragged,
        'file-field__content--error': errorMessage
      }"
    >
      <template v-if="document">
        <button
          v-if="!$attrs.disabled"
          class="app__button-icon file-field__reset-btn"
          type="button"
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

        <div class="file-field__selected-file">
          {{ 'file-field.selected-file' | globalize({ name: document.name }) }}
        </div>
      </template>

      <div class="file-field__inner">
        <template v-if="!$attrs.disabled">
          <i
            v-if="!document"
            class="mdi mdi-upload file-field__icon"
          />

          <div class="file-field__text">
            <p class="file-field__title">
              <template v-if="isFileDragged">
                {{ 'file-field.drop-file-title' | globalize }}
              </template>
              <template v-else-if="document">
                {{ 'file-field.upload-another-file-title' | globalize }}
              </template>

              <template v-else>
                {{ 'file-field.upload-file-title' | globalize }}
              </template>
            </p>

            <div class="file-field__note">
              {{ note }}
            </div>
          </div>
        </template>

        <template v-else-if="!document">
          <i class="mdi mdi-file-hidden file-field__icon" />

          <div class="file-field__text">
            <p class="file-field__title">
              {{ 'file-field.no-file-selected-title' | globalize }}
            </p>
          </div>
        </template>
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
        class="file-field__input"
        :accept="accept"
        title=""
        @change="onChange"
        @dragenter="isFileDragged = true"
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
    fileExtensions: { type: Array, default: _ => DEFAULT_FILE_TYPES },
    maxSize: { type: Number, default: MAX_FILE_MEGABYTES },
    note: { type: String, default: 'All files' },
    errorMessage: { type: String, default: undefined },
  },
  data: _ => ({
    document: null,
    isFileDragged: false,
    url: '',
  }),
  computed: {
    maxSizeBytes () {
      return this.maxSize * 1024 * 1024
    },
    isImageSelected () {
      return this.document.mimeType.includes('image')
    },
    accept () {
      return this.fileExtensions.map(item => `.${item}`).join(', ')
    },
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
    resetField () {
      this.$el.querySelector('input').value = ''
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
        this.resetField()
      }
    },
    isValidFileSize (file) {
      return file.size <= this.maxSizeBytes
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
  color: $field-color-unfocused;
  @include label-font-sizes;
}

.file-field__content {
  margin-top: 0.6rem;
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

  &:not(.file-field__content--disabled):hover {
    border-color: $field-color-text;
  }
}

.file-field__content--highlighted {
  border-color: black;
  background-color: white;
}

.file-field__content--disabled, .file-field__label--disabled {
  filter: grayscale(100%);

  input[type='file'] {
    cursor: default;
  }
}

.file-field__inner {
  margin: 1rem 0rem;
  overflow: hidden;
}

.file-field__text {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .file-field__title {
    color: $field-color-text;
    font-size: 1.6rem;
    margin-bottom: .8rem;
  }
}

.file-field__note {
  color: $file-field-note-color;
  font-size: 1.4rem;
  line-height: 2.2rem;
}

.file-field__selected-file {
  color: $file-field-note-color;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.file-field__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}

.file-field__icon {
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
