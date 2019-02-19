<template>
  <div class="movements-history">
    <template v-if="isInitialized && assetCode">
      <div class="movements-history__list-wrp">
        <movements-table :movements="movements" />
      </div>
      <div class="movements-history__collection-loader-wrp">
        <collection-loader
          :first-page-loader="firstPageLoader"
          @first-page-load="setMovements"
          @next-page-load="concatMovements"
        />
      </div>
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import MovementsTable from './components/movements-table'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

export default {
  name: 'movements-history-module',
  components: {
    MovementsTable,
    CollectionLoader,
  },
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
    assetCode: {
      type: String,
      default: '',
    },
  },
  data: _ => ({
    isInitialized: false,
  }),
  computed: {
    ...mapGetters('movement-history', {
      balances: types.balances,
      movements: types.movements,
    }),
    firstPageLoader () {
      const assetCode = this.assetCode

      return _ => this.loadMovements(assetCode)
    },
  },
  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
    this.isInitialized = true
  },
  methods: {
    ...mapMutations('movement-history', {
      setMovements: types.SET_MOVEMENTS,
      setAccountId: types.SET_ACCOUNT_ID,
      concatMovements: types.CONCAT_MOVEMENTS,
    }),
    ...mapActions('movement-history', {
      loadMovements: types.LOAD_MOVEMENTS,
      loadBalances: types.LOAD_BALANCES,
    }),
  },
}
</script>

<style lang="scss" scoped>
.movements-history__list-wrp {
  overflow-x: auto;
  width: 100%;
}
</style>
