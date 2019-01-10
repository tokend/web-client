<template>
  <div class="tx-history">
    <div class="tx-history__navigation">
      <span class="tx-history__navigation-text">
        {{ 'tx-pages.show' | globalize }}:
      </span>
      <select-field-custom
        v-if="isLoad"
        v-model="tokenCode"
        :values="tokens" />
    </div>
    <div class="tx-history__list">
      <table class="tx-history__table">
        <tr>
          <td>{{ 'tx-pages.date' | globalize }}</td>
          <td>{{ 'tx-pages.txType' | globalize }}</td>
          <td>{{ 'tx-pages.asset' | globalize }}</td>
          <td>{{ 'tx-pages.amount' | globalize }}</td>
          <td class="tx-history__counterparty">
            {{ 'tx-pages.counterparty' | globalize }}
          </td>
          <td class="tx-history__status">
            {{ 'tx-pages.status' | globalize }}
          </td>
          <td class="tx-history__td-btn" />
        </tr>
      </table>
      <template v-for="(tx, i) in operations">
        <operation-record :tx="tx" :key="`tx-row-${i}`" />
      </template>
    </div>
  </div>
</template>

<script>
import OperationRecord from '@/vue/common/OperationRecord'
import SelectFieldCustom from '@/vue/fields/SelectFieldCustom'
// import { ErrorHandler } from '@/js/helpers/error-handler'
// import { vuexTypes } from 'L@/vuex/types'
import { Sdk } from '@/sdk'
// import { globalize } from '@/vue/filters/globalize'
import get from 'lodash/get'

export default {
  name: 'history-index',
  components: {
    OperationRecord,
    SelectFieldCustom
  },
  data: _ => ({
    tokenCode: null,
    assets: [],
    operations: [],
    isLoad: false
  }),
  computed: {
    list () {
      return []
    },
    isLoaded () {
      return get(this.operations, `${this.tokenCode}.isLoaded`)
    },
    tokens () {
      return this.assets.map(item => {
        return item.code
      })
    }
  },
  watch: {
    tokenCode (code) {
    }
  },
  async created () {
    const assetsResponse = await Sdk.horizon.assets.getAll()
    this.assets = assetsResponse.data
    this.tokenCode = this.$route.params.tokenCode || this.tokens[0] || null
    if (this.tokenCode) {
      const operationsResponse = await Sdk.horizon.payments
        .getPage({ asset: 'BTC' })
      this.operations = operationsResponse.data
    }
    this.isLoad = true
  },
  methods: {
  }
}
</script>

<style lang="scss">
  @import '../../scss/variables';

  $padding-vertical: 20px;
  $padding-horizontal: 25px;
  $padding: $padding-vertical $padding-horizontal;

  .tx-history {
    width: 100%;
    padding: 0 12px;
  }

  .tx-history__table {
    margin: 0 !important;
  }

  .tx-history__table-toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    @media (max-width: 840px) {
      flex-direction: column;
      padding-top: $padding-vertical;
    }
  }

  .tx-history__row {
    cursor: pointer;
  }

  .tx-history__table-cell {
    overflow: hidden;
    white-space: nowrap;

    &--counterparty {
      max-width: 10rem;
    }

    & > .md-table-cell-container {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .tx-history__select-outer {
    padding: 5px $padding-horizontal;
  }

  .tx-history__details {
    padding: $padding;
    max-width: 25rem;
    width: 100%;
  }

  .tx-history__more-btn-outer {
    text-align: center;
  }

  .tx-history__no-operations {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .tx-history__navigation{
    display: flex;
    align-items: center;
    margin-bottom: 52px;
  }

  .tx-history__navigation-text{
    margin-right: 15px;
  }

  .tx-history__table {
    width: 100%;
    table-layout: fixed;
    td {
      padding: 7px 15px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .tx-history__td-btn {
      text-align: right;
      width: 67px;
    }

    .tx-history__counterparty{
      width: 300px;
    }

    .tx-history__status{
      width: 130px;
    }
  }
</style>
