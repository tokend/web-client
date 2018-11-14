<template>
  <md-dialog
    :md-active.sync="show"
    @md-closed="closeDialog"
    class="info-dialog">
    <md-dialog-title> {{ i18n.lbl_transaction_details() }}</md-dialog-title>

    <div class="app__dialog-inner">
      <tx-details
        class="info-dialog__history"
        :tx="dialogValues" />
    </div>

    <md-dialog-actions class="info-dialog__actions">
      <button
        v-ripple
        @click="closeDialog"
        class="app__button-flat">
        {{ i18n.lbl_close() }}
      </button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import TxDetails from '../../history/index/History.TxDetails'
import { i18n } from 'L@/js/i18n'

export default {
  name: 'info-dialog',
  components: { TxDetails },
  props: {
    showDialog: { type: Boolean, default: false },
    dialogValues: { type: Object, default: () => {} }
  },
  data () {
    return {
      show: this.showDialog,
      i18n
    }
  },
  methods: {
    closeDialog (value) {
      this.$emit('close-dialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '~L@scss/variables.scss';
  @import '~L@scss/mixins.scss';

  .info-dialog {
    padding: 8px 16px;
  }

  .info-dialog__history {
    width: 100%;
    padding-right: 46px;
    min-width: 400px;

    @include respond-to(xsmall) {
      min-width: inherit;
      padding-right: 25px;
    }
  }

  .info-dialog__list {
    @include respond-to-height(700px) {
      overflow: auto;
    }
  }

  .info-dialog__label {
    width: 220px;
    padding-right: 16px;

    @include respond-to(small) {
      width: 150px;
    }

    @include respond-to(xsmall) {
      width: 100%;
      margin-bottom: 8px;
    }
  }

  .info-dialog__value {
    width: 240px;
    padding-right: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include respond-to(medium) {
      width: calc(100% - 220px);
    }

    @include respond-to(small) {
      width: calc(100% - 150px);
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
    margin-bottom: 8px;
    padding-bottom: 8px;

    &:not(:last-child) {
      border-bottom: 1px solid $_gray;
    }
  }

</style>
