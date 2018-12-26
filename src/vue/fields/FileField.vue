<template>
  <div class="file-field">
    <div class="file-field__label">
      {{ label }}
    </div>
    <div class="file-input">
      <div
        class="file-input__file-preview"
        v-if="fileUrl">
        <span>{{ fileUrl }}</span>
      </div>
      <div class="file-input__input-inner">
        <div class="file-input__text">
          <div class="title">{{ 'Drop files here or click to browse' }}</div>
          <div class="notes">
            <p class="file-input__note">{{ note }}</p>
          </div>
        </div>
        <input
          type="file"
          class="file-field__file-input"
          :disabled="disabled"
          :accept="accept"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'file-field',
  props: {
    label: { type: String, default: '' },
    type: { type: String, default: 'default' },
    private: { type: Boolean, default: false },
    minSize: { type: Number, default: null },
    maxSize: { type: Number, default: 5 },
    minWidth: { type: Number, default: null },
    minHeight: { type: Number, default: null },
    accept: { type: String, default: 'image/png, image/jpeg' },
    note: { type: String, default: '' },
    fileType: { type: String, default: 'default' },
    disabled: { type: Boolean, default: false }
  },
  computed: {
    fileUrl () {
      if (!this.value) return ''
      if (this.value.file) {
        return this.value.dataUrl
      }
      if (!this.private) {
        return this.value.publicUrl
      }
      return this.value.privateUrl
    }
  }
}
</script>

<style lang="scss" scoped>
@import "scss/variables";
@import '~@scss/mixins';

.file-field {
  position: relative;
  display: flex;
  flex-direction: column;
}

.file-field__label {
  font-size: 1.1rem;
  color: #3a4180;
  margin-bottom: 1.2rem;
}

.file-field__input {
  width: .01rem;
  height: .01rem;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-input {
  border: .2rem dashed #c4c8cb;
  background-color: #f5f6f9;
  border-radius: .4rem;
  transition: .2s;
  width: 100%;

  &:hover {
    border-color: $field-color-text;
  }
}

.file-input__input-inner {
  height: 9.4rem;
  position: relative;
  overflow: hidden;
  width: 100%;

  input[type='file'] {
    cursor: pointer;
    opacity: 0;
    height: 100%;
    width: 100%;
  }
}

.file-input__text {
  height: 100%;
  left: 0;
  position: absolute;
  text-align: center;
  top: .5rem;
  width: 100%;
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
  align-items: center;
  display: flex;
  justify-content: center;
  pointer-events: none;
  overflow: hidden;
}
</style>
