<template>
  <div class="clipboard-field">
    <button
      class="clipboard-field__button"
      id="clipboard-btn"
      :data-clipboard-target="`#clipboard-target-${id}`"
    >
      <i class="mdi mdi-content-copy clipboard-field__copy-icon" />
    </button>
    <div class="clipboard-field__content">
      <span class="clipboard-field__value" :id="`clipboard-target-${id}`">
        {{ value }}
      </span>
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
    id: { type: String, required: true },
  },
  mounted () {
    const btn = document.querySelector('#clipboard-btn')
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.clipboard-field__content {
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 90%;
}

.clipboard-field__value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  color: $field-color-text;
  @include text-font-sizes;
}

.clipboard-field__button {
  @include button-icon();
  margin-right: .25rem;
}
.clipboard-field__copy-icon {
  font-size: 2rem;
  display: flex;
}
</style>
