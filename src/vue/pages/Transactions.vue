<template>
  <div class="tx-history">
    <div class="tx-history__navigation">
      <select-field-custom
        :label="'tx-pages.asset'"
        v-model="tokenCode"
        :values="tokens" />tx-history__navigation
    </div>
    <div class="tx-history__list">
      <table class="tx-history__table">
        <tr>
          <td>{{ 'tx-pages.date' | globalize }}</td>
          <td>{{ 'tx-pages.txType' | globalize }}</td>
          <td>{{ 'tx-pages.asset' | globalize }}</td>
          <td>{{ 'tx-pages.amount' | globalize }}</td>
          <td>{{ 'tx-pages.counterparty' | globalize }}</td>
          <td>{{ 'tx-pages.status' | globalize }}</td>
        </tr>
      </table>
      <template v-for="(tx, i) in list">
        <transaction-record :tx="tx" :key="`tx-row-${i}`" />
      </template>
    </div>
  </div>
</template>

<script>
import TransactionRecord from '@/vue/common/TransactionRecord'
import SelectFieldCustom from '@/vue/fields/SelectFieldCustom'
import { ErrorHandler } from '@/js/helpers/error-handler'
// import { vuexTypes } from 'L@/vuex/types'
// import { Sdk } from '@/sdk'
// import { globalize } from '@/vue/filters/globalize'
import get from 'lodash/get'

export default {
  name: 'history-index',
  components: {
    TransactionRecord,
    SelectFieldCustom
  },
  data: _ => ({
    isLoading: false,
    tokenCode: null,
    index: -1
  }),
  computed: {
    list () {
      return []
      // return (get(this.transactions, `${this.tokenCode}.records`) || [])
      //   .reduce((list, item) => {
      //     if (item instanceof RecordTypes.MatchRecord) {
      //       item.transactions.forEach(tx => {
      //         list.push(tx)
      //       })
      //       return list
      //     }
      //     list.push(item)
      //     return list
      //   }, [])
    },
    isLoaded () {
      return get(this.transactions, `${this.tokenCode}.isLoaded`)
    },
    tokens () {
      return ['BTC', 'ETH']
      // return this.userAcquiredTokens.map(token => token.code)
    }
  },
  watch: {
    tokenCode (code) {
      // this.loadList(code)
    }
  },
  async created () {
    // this.loadTokens()
    this.tokenCode = this.$route.params.tokenCode || this.tokens[0] || null
    // if (this.tokenCode) {
    //   await this.loadList(this.tokenCode)
    // }
  },
  methods: {
    toggleDetails (index) {
      this.index = this.index === index ? -1 : index
    },
    isSelected (i) {
      return this.index === i
    },
    async more () {
      this.isLoading = true
      try {
        await this.loadNext(this.tokenCode)
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
        // EventDispatcher
        //   .dispatchShowErrorEvent(globalize('tx-pages.failedToLoadTx'))
      }
      this.isLoading = false
    }
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

  .tx-history__no-transactions {
    padding: 0 16px 32px;
    text-align: center;

    p {
      margin-top: 10px;
    }
  }

  .tx-history__navigation{
    margin-bottom: 52px;
  }

  .tx-history__table {
    width: 100%;
    table-layout: fixed;
    td{
      padding: 7px 15px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
