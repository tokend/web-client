<template>
  <div class="clipboard__outer">
    <div
      class="clipboard"
      :class="{'clipboard--monospaced': monospaced}">
      <div class="clipboard__value-outer">
        <label class="clipboard__label">{{ label }}</label>
        <span
          class="clipboard__value"
          id="clipboard-target">
          {{ value }}
        </span>
      </div>
      <md-button
        class="md-icon-button"
        id="clipboard-btn"
        @click="showSuccess"
        data-clipboard-target="#clipboard-target"
      >
        <md-icon class="clipboard__icon md-icon-half-sized">
          content_copy
        </md-icon>
        <md-tooltip>Copy</md-tooltip>
      </md-button>
    </div>
  </div>
</template>

<script>
import { EventDispatcher } from '../../../js/events/event_dispatcher'
import { i18n } from '../../../js/i18n/index'

import Clipboard from 'clipboard'

export default {
  name: 'clipboard-field',
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
    monospaced: { type: Boolean, default: false }
  },
  mounted () {
    const btn = document.querySelector('#clipboard-btn')
    if (!btn) return
    this.clipboard = new Clipboard(btn)
  },
  methods: {
    showSuccess () {
      EventDispatcher.dispatchShowSuccessEvent(i18n.dep_copied())
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';
  @import '../../../scss/mixins';
  @import 'scss/fields-variables';

  .clipboard {
    align-items: center;
    display: flex;
    justify-content: space-between;
    flex: 1;
    width: 100%;
    @include material-border($field-color-focused, $field-color-unfocused);
  }

  .clipboard--monospaced > .clipboard__value-outer > .clipboard__value {
    font-family: 'SourceCodePro', Courier, monospace !important;
    font-weight: 500;
  }

  .clipboard__outer {
    width: 100%;
  }

  .clipboard__value {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    color: $field-color-text;
    display: inline-block;
    padding: $field-input-padding;
    @include text-font-sizes;
  }

  .clipboard__value-outer {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 75%;
    width: calc(100% - 48px);
  }

  .clipboard__label {
    font-size: .8rem;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    color: $field-color-unfocused;
    @include label-font-sizes;
  }
</style>
