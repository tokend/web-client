<template>
  <tabs>
    <tab :name="i18n.lbl_token_creation()" id="token-creation">
      <token-creation />
    </tab>
    <tab :name="i18n.lbl_sale_creation()" id="sale-creation">
      <sale-creation />
    </tab>
    <tab :name="i18n.preis_upload()" id="pre-issuance-upload">
      <pre-issuance-upload />
    </tab>
    <tab :name="'Withdrawal requests'" id="withdrawal-requests">
      <withdrawal-requests />
    </tab>
  </tabs>
</template>

<script>
import TokenCreation from './Requests.TokenCreation'
import PreIssuanceUpload from './Requests.PreissuanceUpload'
import WithdrawalRequests from './Requests.Withdrawal'
import SaleCreation from './Requests.SaleCreation'
import { i18n } from 'L@/js/i18n'
import Tabs from 'L@/vue/app/common/tabs/Tabs'
import Tab from 'L@/vue/app/common/tabs/Tab'

export default {
  components: {
    TokenCreation,
    SaleCreation,
    PreIssuanceUpload,
    WithdrawalRequests,
    Tabs,
    Tab
  },
  data: _ => ({
    i18n
  })
}
</script>

<style lang="scss">
@import "~L@scss/variables";
@import "~L@scss/mixins";

.requests__tabs {
  .md-title,
  .md-table-cell-container {
    color: $col-tabs-txt !important;
  }

  .md-table-head-label {
    color: rgba($col-tabs-txt, .7) !important;
  }

  .md-tab {
    padding: 0;
  }

  .md-card {
    box-shadow: none;
  }

  .md-tabs-content {
    height: auto !important;
    min-height: 100% !important;
    background-color: transparent;
  }

  @include overwrite-tabs(50);
}
</style>
