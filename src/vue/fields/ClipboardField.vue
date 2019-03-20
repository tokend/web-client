<template>
  <div class="clipboard-field">
    <div class="clipboard-field__content">
      <label class="clipboard-field__label">
        {{ label }}
      </label>
      <span class="clipboard-field__value" :id="`clipboard-target-${value}`">
        {{ value }}
      </span>
      <button
        type="button"
        class="clipboard-field__button"
        :id="`clipboard-btn-${id || value}`"
        :data-clipboard-target="`#clipboard-target-${value}`"
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
    id: { type: String, default: '' },
  },
  mounted () {
    const btn = document.querySelector(
      `#clipboard-btn-${this.id || this.value}`
    )
    if (!btn) return
    this.clipboard = new Clipboard(btn)
  },
}
</script>

<style lang="scss" scoped>
@import './scss/variables';
@import '~@scss/variables';
@import '~@scss/mixins';

.clipboard-field {
  border-bottom: .1rem solid $col-primary;
  display: flex;
  align-items: center;
  width: 100%;
}

.clipboard-field__content {
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;
}

.clipboard-field__value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: $field-color-text;
  padding: $field-input-padding;
  @include text-font-sizes;
}

.clipboard-field__label {
  font-size: .8rem;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  color: $field-color-unfocused;
  @include label-font-sizes;
}

.clipboard-field__button {
  @include button-icon();
  padding: 0;
  min-width: 4.5rem;
  min-height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clipboard-field__copy-icon {
  font-size: 2.4rem;
  padding-top: .4rem;
  color: $col-primary-lighten;
}
</style>
