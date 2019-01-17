<template>
  <div class="op-history">
    <template v-if="!isLoadFailed">
      <div class="op-history__navigation">
        <span class="op-history__navigation-text">
          {{ 'tx-pages.show' | globalize }}:
        </span>
        <select-field-custom
          v-if="isLoaded"
          v-model="tokenCode"
          :values="tokens"
        />
      </div>
      <div class="op-history__list" v-if="isLoaded">
        <template v-if="operations.length">
          <table class="op-history__table">
            <tr>
              <td>{{ 'tx-pages.date' | globalize }}</td>
              <td>{{ 'tx-pages.tx-type' | globalize }}</td>
              <td>{{ 'tx-pages.amount' | globalize }}</td>
              <td class="op-history__counterparty">
                {{ 'tx-pages.counterparty' | globalize }}
              </td>
              <td class="op-history__status">
                {{ 'tx-pages.status' | globalize }}
              </td>
              <td class="op-history__td-btn" />
            </tr>
          </table>
          <template v-for="(operation, i) in operations">
            <operation-record
              :operation-data="operation"
              :key="`tx-row-${i}}-${tokenCode}`" />
          </template>
        </template>
        <template v-else>
          <div class="op-history__no-transactions">
            <i class="op-history__no-tx-icon mdi mdi-trending-up" />
            <h2>{{ 'tx-pages.no-transaction-history' | globalize }}</h2>
            <p>{{ 'tx-pages.here-will-be-the-list' | globalize }}</p>
          </div>
        </template>
        <collection-loader
          :first-page-loader="pageLoader"
          @first-page-load="setFirstPageData"
          @next-page-load="setNextPageData"
        />
      </div>
    </template>
    <template v-else>
      <div class="op-history__error">
        <i class="op-history__error-icon mdi mdi-comment-alert-outline" />
        <h2>{{ 'tx-pages.something-went-wrong' | globalize }}</h2>
        <p>{{ 'tx-pages.can-not-load-assets' | globalize }}</p>
      </div>
    </template>
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
    isLoaded: false,
    isLoadFailed: false,
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
      this.isLoaded = true
    } catch (e) {
      this.isLoadFailed = true
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

  .op-history__navigation{
    display: flex;
    align-items: center;
    margin-bottom: 6.2rem;
  }

  .op-history__navigation-text{
    margin-right: 1.5rem;
  }

  .op-history__list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .op-history__table {
    width: 100%;
    table-layout: fixed;
    td {
      padding: 0.7rem 1.5rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .op-history__td-btn {
      text-align: right;
      width: 6.7rem;
    }

    .op-history__counterparty {
      width: 30rem;
    }

    .op-history__status{
      width: 13rem;
    }
  }

  .op-history__no-transactions {
    padding: 0 1.6rem 3.2rem;
    text-align: center;

    p {
      margin-top: 1rem;
    }
  }

  .op-history__no-tx-icon {
    margin-right: 1.6rem;
    font-size: 6.4rem;
  }

  .op-history__error {
    padding: 0 1.6rem 3.2rem;
    text-align: center;
    color: $col-error;
    p {
      margin-top: 1rem;
    }
  }

  .op-history__error-icon {
    margin-right: 1.6rem;
    font-size: 6.4rem;
  }
</style>
