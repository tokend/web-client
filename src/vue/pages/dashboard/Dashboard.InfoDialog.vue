<template>
  <md-dialog
    :md-active.sync="show"
    @md-closed="closeDialog"
    class="info-dialog">
    <md-dialog-title>
      {{ 'dashboard.transaction-details' | globalize }}
    </md-dialog-title>

    <div class="app__dialog-inner">
      <record-details-viewer
        class="info-dialog__history"
        :tx="dialogValues"
      />
    </div>

    <md-dialog-actions class="info-dialog__actions">
      <button
        v-ripple
        @click="closeDialog"
        class="app__button-flat">
        {{ 'dashboard.close' | globalize }}
      </button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import RecordDetailsViewer from '@/vue/common/RecordDetailsViewer'

const EVENTS = {
  closeDealog: 'close-dialog'
}

export default {
  name: 'info-dialog',
  components: { RecordDetailsViewer },
  props: {
    showDialog: { type: Boolean, default: false },
    dialogValues: { type: Object, default: () => {} }
  },
  data: () => ({
    show: this.showDialog,
    EVENTS
  }),
  methods: {
    closeDialog (value) {
      this.$emit(this.EVENTS.closeDealog, false)
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  .info-dialog {
    padding: .8 * $point 1.6 * $point;
  }

  .info-dialog__history {
    width: 100%;
    padding-right: 4.6 * $point;
    min-width: 40 * $point;

    @include respond-to(xsmall) {
      min-width: inherit;
      padding-right: 2.5 * $point;
    }
  }

  .info-dialog__list {
    @include respond-to-height(70 * $point) {
      overflow: auto;
    }
  }

  .info-dialog__label {
    width: 22 * $point;
    padding-right: 1.6 * $point;

    @include respond-to(small) {
      width: 15 * $point;
    }

    @include respond-to(xsmall) {
      width: 100%;
      margin-bottom: .8 * $point;
    }
  }

  .info-dialog__value {
    width: 24 * $point;
    padding-right: 3 * $point;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include respond-to(medium) {
      width: calc(100% - (22 * #{$point}));
    }

    @include respond-to(small) {
      width: calc(100% - (15 * #{$point}));
    }

    @include respond-to(xsmall) {
      width: 100%;
    }
  }

  .info-dialog__clipboard {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .info-dialog__item {
    margin-bottom: .8 * $point;
    padding-bottom: .8 * $point;

    &:not(:last-child) {
      border-bottom: .1 * $point solid $_gray;
    }
  }

</style>
