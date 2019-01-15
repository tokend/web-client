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
    <div class="tx-history__list" v-if="isLoad">
      <template v-if="operations.length">
        <table class="tx-history__table">
          <tr>
            <td>{{ 'tx-pages.date' | globalize }}</td>
            <td>{{ 'tx-pages.txType' | globalize }}</td>
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
        <template v-for="(operation, i) in operations">
          <operation-record
            :operation-data="operation"
            :key="`tx-row-${i}}-${tokenCode}`" />
        </template>
      </template>
      <template v-else>
        <div class="tx-history__no-transactions">
          <i class="tx-history__no-tx-icon mdi mdi-trending-up" />
          <h2>{{ 'tx-pages.noTransactionHistory' | globalize }}</h2>
          <p>{{ 'tx-pages.hereWillBeTheList' | globalize }}</p>
        </div>
      </template>
      <collection-loader
        :first-page-loader="pageLoader"
        @first-page-load="setFirstPageData"
        @next-page-load="setNextPageData"
      />
    </div>
  </div>
</template>

<script>
import OperationRecord from '@/vue/common/OperationRecord'
import SelectFieldCustom from '@/vue/fields/SelectFieldCustom'
import CollectionLoader from '@/vue/common/CollectionLoader'
import { Sdk } from '@/sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'history-index',
  components: {
    OperationRecord,
    SelectFieldCustom,
    CollectionLoader
  },
  data: _ => ({
    tokenCode: null,
    assets: [],
    operations: [],
    isLoad: false,
    pageLoader: () => {}
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId
    ]),
    tokens () {
      return this.assets.map(item => {
        return item.code
      })
    }
  },
  watch: {
    tokenCode () {
      this.pageLoader = this.getPageLoader(this.accountId,
        { asset: this.tokenCode })
    }
  },
  async created () {
    try {
      const assetsResponse = await Sdk.horizon.assets.getAll()
      this.assets = assetsResponse.data
      this.tokenCode = this.$route.params.tokenCode || this.tokens[0] || null
      this.isLoad = true
    } catch (e) {
      console.error(e)
      ErrorHandler.process(e)
    }
  },
  methods: {
    getPageLoader (accountId, filter) {
      return function () {
        return Sdk.horizon.account.getPayments(accountId, filter)
      }
    },

    setFirstPageData (data) {
      this.operations = [...data]
    },

    setNextPageData (data) {
      this.operations = [...this.operations, ...data]
    }
  }
}
</script>

<style lang="scss">
  @import '../../scss/variables';

  .tx-history__navigation{
    display: flex;
    align-items: center;
    margin-bottom: 52px;
  }

  .tx-history__navigation-text{
    margin-right: 15px;
  }

  .tx-history__list {
    display: flex;
    flex-direction: column;
    align-items: center;
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

  .tx-history__no-transactions {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .tx-history__no-tx-icon {
    margin-right: 1.6rem;
    font-size: 6.4rem;
  }
</style>
