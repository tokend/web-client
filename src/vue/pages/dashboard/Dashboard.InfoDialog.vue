<template>
  <md-dialog
    :md-active.sync="show"
    @md-closed="closeDialog"
    class="info-dialog">
    <md-dialog-title>
      {{ 'dashboard.transaction-details' | globalize }}
    </md-dialog-title>

    <div class="app__dialog-inner">
      <!-- <record-details-viewer
        class="info-dialog__history"
        :tx="dialogValues"
      /> -->
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
// import RecordDetailsViewer from '@/vue/common/RecordDetailsViewer'

const EVENTS = {
  closeDealog: 'close-dialog'
}

export default {
  name: 'info-dialog',
  // components: { RecordDetailsViewer },
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
    padding: .8rem 1.6rem;
  }

  .info-dialog__history {
    width: 100%;
    padding-right: 4.6rem;
    min-width: 40rem;

    @include respond-to(xsmall) {
      min-width: inherit;
      padding-right: 2.5rem;
    }
  }

  .info-dialog__list {
    @include respond-to-height(70rem) {
      overflow: auto;
    }
  }

  .info-dialog__label {
    width: 22rem;
    padding-right: 1.6rem;

    @include respond-to(small) {
      width: 15rem;
    }

    @include respond-to(xsmall) {
      width: 100%;
      margin-bottom: .8rem;
    }
  }

  .info-dialog__value {
    width: 24rem;
    padding-right: 3rem;
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
    margin-bottom: .8rem;
    padding-bottom: .8rem;

    &:not(:last-child) {
      border-bottom: .1rem solid $_gray;
    }
  }

</style>
