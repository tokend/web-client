<template>
  <div class="clipboard-field">
    <div class="clipboard-field__content">
      <label class="clipboard-field__label">
        {{ label }}
      </label>
      <span
        class="clipboard-field__value"
        :id="`clipboard-target-${_uid}`"
      >{{ value }}</span>
      <!--
        keep the formatting right above as is to prevent trailing
        whitespace copying issue
      -->
      <tooltip
        :show="isCopiedTooltipShown"
        :message="'clipboard-field.copied' | globalize"
        :type="tooltipType"
      >
        <button
          type="button"
          class="clipboard-field__button app__button-icon"
          @click="showCopiedTooltip"
          :id="`clipboard-btn-${_uid}`"
          :data-clipboard-target="`#clipboard-target-${_uid}`"
        >
          <i class="mdi mdi-content-copy clipboard-field__copy-icon" />
        </button>
      </tooltip>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import Tooltip from '@/vue/common/Tooltip'

export default {
  name: 'clipboard-field',
  components: {
    Tooltip,
  },
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
    tooltipType: { type: String, default: '' },
  },
  data: _ => ({
    isCopiedTooltipShown: false,
  }),
  mounted () {
    const btn = document.querySelector(
      `#clipboard-btn-${this._uid}`,
    )
    if (!btn) return
    this.clipboard = new Clipboard(btn)
  },
  methods: {
    showCopiedTooltip () {
      let hideTooltipTimeout = 2000
      this.isCopiedTooltipShown = true
      setTimeout(() => {
        this.isCopiedTooltipShown = false
      }, hideTooltipTimeout)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './scss/variables';
@import '~@scss/variables';
@import '~@scss/mixins';

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
  color: $col-text;
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
  top: 0.8rem;
  pointer-events: none;
  color: $col-text-inactive;

  @include label-font-sizes;
}

.clipboard-field__button {
  width: 3.2rem;
  height: 3.2rem;
  margin-right: 0.4rem;
}

.clipboard-field__copy-icon {
  font-size: 1.8rem;
}
</style>
