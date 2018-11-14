<template>
  <p class="detail-row">
    <span class="detail-row__key">{{ prop }}</span>
    <span class="detail-row__value">
      <span
        class="detail-row__value-text"
        :id="copiable ? `clipboard-target-${id}` : ''">
        <template v-if="value">
          {{ value || '—' }}
        </template>
        <template v-else>
          <slot />
        </template>
      </span>
      <md-button
        v-if="copiable"
        class="detail-row__clipboard-btn md-icon-button"
        id="clipboard-btn"
        @click="showCopySuccess"
        :data-clipboard-target="`#clipboard-target-${id}`"
      >
        <md-icon class="detail-row__clipboard-icon md-icon-size-065x">
          content_copy
        </md-icon>
        <md-tooltip>Copy</md-tooltip>
      </md-button>
    </span>
  </p>
</template>

<script>
import Clipboard from 'clipboard'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { i18n } from 'L@/js/i18n'

export default {
  name: 'detail-row',
  props: {
    prop: { type: String, default: '' },
    value: { type: [String, Number, Array], default: '' },
    copiable: { type: Boolean, default: false }
  },
  data: _ => ({
    clipboard: null,
    id: null
  }),

  mounted () {
    this.id = this._uid
    if (!this.copiable) return
    this.clipboard = new Clipboard(this.$el.querySelector('#clipboard-btn'))
  },
  methods: {
    showCopySuccess () {
      EventDispatcher.dispatchShowSuccessEvent(i18n.dep_copied())
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';
  @import '~L@scss/mixins';

  .detail-row {
    display: flex;
    justify-content: space-between;
    line-height: 1.6rem;
    width: 100%;

    .sales-tabs__tab-inner & {
      justify-content: flex-start;
    }
  }

  .detail-row__key {
    color: $col-details-label;

    .sales-tabs__tab-inner & {
      width: calc(100% - 170px);
    }
  }

  .detail-row__value {
    position: relative;
    color: $col-details-value;

    .detail-row__clipboard-btn {
      @include center-vertically;

      position: absolute;
      right: -48px;
    }
  }

  .detail-row__value-text {
    display: block;
    max-width: 12rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .detail-row__clipboard-icon {
    position: relative;
    bottom: .1rem;
  }
</style>
