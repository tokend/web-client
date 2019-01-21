<template>
  <div class="op-history">
    <template v-if="!isLoadFailed">
      <div class="op-history__navigation">
        <span class="op-history__navigation-text">
          {{ 'op-pages.show' | globalize }}:
        </span>
        <select-field-custom
          v-if="isLoaded"
          v-model="tokenCode"
          :values="tokens"
        />
      </div>
      <div
        class="op-history__table-wrp"
        v-if="isLoaded"
      >
        <template v-if="operations.length">
          <op-list :list="operations" />
        </template>
        <template v-else>
          <div class="op-history__no-transactions">
            <i class="op-history__no-tx-icon mdi mdi-trending-up" />
            <h2>{{ 'op-pages.no-operation-history' | globalize }}</h2>
            <p>{{ 'op-pages.here-will-be-the-list' | globalize }}</p>
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
        <h2>{{ 'op-pages.something-went-wrong' | globalize }}</h2>
        <p>{{ 'op-pages.can-not-load-assets' | globalize }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import SelectFieldCustom from '@/vue/fields/SelectFieldCustom'
import CollectionLoader from '@/vue/common/CollectionLoader'
import OpList from '@/vue/common/OpList'
import { Sdk } from '@/sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { RecordWrapper } from '@/js/records'
import { MatchRecord } from '@/js/records/operations/match.record'

export default {
  name: 'history-index',
  components: {
    SelectFieldCustom,
    CollectionLoader,
    OpList,
  },
  data: _ => ({
    tokenCode: null,
    assets: [],
    operations: [],
    isLoaded: false,
    isLoadFailed: false,
    pageLoader: () => { },
  }),
  computed: {
    ...mapGetters([
      vuexTypes.account,
      vuexTypes.accountId,
    ]),
    tokens () {
      return this.assets.map(item => item.code)
    },
    balanceId () {
      return this.account.balances
        .find(item => item.asset === this.tokenCode)
        .balanceId
    },
  },
  watch: {
    tokenCode () {
      this.pageLoader = this.getPageLoader(this.accountId, {
        asset: this.tokenCode,
      })
    },
  },
  async created () {
    try {
      const { data: assets } = await Sdk.horizon.assets.getAll()
      this.assets = assets
      this.tokenCode = this.$route.params.tokenCode || this.tokens[0] || null
      this.isLoaded = true
    } catch (e) {
      this.isLoadFailed = true
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
      this.operations = this.parseOperations(data)
    },

    setNextPageData (data) {
      this.operations = this.operations.concat(this.parseOperations(data))
    },

    parseOperations (operations) {
      return operations.map((operation) => {
        return RecordWrapper.operation(operation, {
          accountId: this.accountId,
          asset: this.asset,
          balanceId: this.balanceId,
        })
      }).reduce((list, item) => {
        if (item instanceof MatchRecord) {
          item.effects.forEach(tx => { list.push(tx) })
          return list
        }
        list.push(item)
        return list
      }, [])
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.op-history__navigation {
  display: flex;
  align-items: center;
  margin-bottom: 6.2rem;
}

.op-history__navigation-text {
  margin-right: 1.5rem;
}

.op-history__table-wrp {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.op-history__table {
  width: 100%;
  table-layout: fixed;
  border-spacing: 0 0.6rem;
  border-color: transparent;
  // border-collapse: collapse;

  .op-history__td-btn {
    text-align: right;
    width: 6.7rem;
  }

  .op-history__counterparty {
    width: 30rem;
  }

  .op-history__status {
    width: 13rem;
  }
}

.op-history__th {
  padding: 0 1.5rem 1rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  font-size: 1.4rem;
  color: $col-text-secondary;
  font-weight: normal;
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
