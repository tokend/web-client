<template>
  <div class="clipboard-field">
    <div class="clipboard-field__content">
      <label class="clipboard-field__label">
        {{ label }}
      </label>
      <span
        class="clipboard-field__value"
        :id="`clipboard-target-${_uid}`"
      >
        {{ value }}
      </span>
      <button
        type="button"
        class="clipboard-field__button"
        :id="`clipboard-btn-${_uid}`"
        :data-clipboard-target="`#clipboard-target-${_uid}`"
      >
        <i class="mdi mdi-content-copy clipboard-field__copy-icon" />
      </button>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
export default {
  name: 'clipboard-field',
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  mounted () {
    const btn = document.querySelector(
      `#clipboard-btn-${this._uid}`
    )
    if (!btn) return
    this.clipboard = new Clipboard(btn)
  },
}
</script>

<style lang="scss" scoped>
@import "./scss/variables";
@import "~@scss/variables";
@import "~@scss/mixins";

.clipboard-field {
  background: $col-clipboard-background;
  width: 100%;
}

.clipboard-field__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
}

.clipboard-field__value {
  width: 100%;
  overflow: auto;
  color: $field-color-text;
  padding: 2.6rem 0 0.6rem 1.2rem;
  font-size: 1.3rem;
  line-height: 1.25;
  font-family: monospace;
  word-break: break-word;

  @include respond-to($x-medium) {
    font-size: 1.1rem;
  }
}

.clipboard-field__label {
  font-size: 0.8rem;
  position: absolute;
  left: 1.2rem;
  top: .8rem;
  pointer-events: none;
  color: $field-color-unfocused;
  @include label-font-sizes;
}

.clipboard-field__button {
  @include button-icon();
  width: 3.2rem;
  height: 3.2rem;
  margin-right: 0.4rem;
}

.clipboard-field__copy-icon {
  font-size: 1.8rem;
}
</style>
