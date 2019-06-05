<template>
  <div class="shares-history">
    <template v-if="isInitialized && assetCode">
      <template v-if="isSharesLoaded">
        <h2 class="app__table-title" v-if="latestActivity">
          {{ 'movements-history.latest-activity' | globalize }}
        </h2>
        <div class="shares-history__list-wrp">
          <movements-table :movements="shares" />
        </div>
      </template>
      <template v-else-if="isSharesLoadFailed">
        <p class="shares-history__error-msg">
          {{ 'movements-history.movements-load-failed-msg' | globalize }}
        </p>
      </template>
      <template v-else>
        <load-spinner message-id="movements-history.loading-movements-msg" />
      </template>

      <div class="shares-history__collection-loader-wrp">
        <collection-loader
          v-if="!isSharesLoadFailed"
          v-show="isSharesLoaded && !latestActivity"
          :first-page-loader="firstPageLoader"
          @first-page-load="setShares"
          @next-page-load="concatShares"
          :ref="REFS.collectionLoader"
        />
      </div>
    </template>

    <template v-else>
      <load-spinner message-id="movements-history.initializing-msg" />
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import MovementsTable from './components/movements-table'
import LoadSpinner from '@/vue/common/Loader'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { types } from './store/types'

const REFS = {
  collectionLoader: 'collection-loader',
}

export default {
  name: 'shares-history-module',
  components: {
    LoadSpinner,
    MovementsTable,
    CollectionLoader,
  },
  props: {
    assetCode: {
      type: String,
      default: '',
    },
    latestActivity: {
      type: Boolean,
      default: false,
    },
  },
  data: _ => ({
    isInitialized: false,
    isSharesLoaded: false,
    isSharesLoadFailed: false,
    REFS,
  }),
  computed: {
    ...mapGetters('shares-history', {
      balances: types.balances,
      shares: types.shares,
    }),

    firstPageLoader () {
      const assetCode = this.assetCode // HACK: passing this.assetCode directly
      // to function will lead to losing reactivity
      return _ => this.loadSharesFirstPage(assetCode)
    },
  },
  async created () {
    await this.loadBalances()
    this.isInitialized = true
  },
  methods: {
    ...mapMutations('shares-history', {
      setShares: types.SET_SHARES,
      concatShares: types.CONCAT_SHARES,
    }),
    ...mapActions('shares-history', {
      loadBalances: types.LOAD_BALANCES,
      loadShares: types.LOAD_SHARES,
    }),

    reloadCollectionLoader () {
      return this.$refs[REFS.collectionLoader].loadFirstPage()
    },

    async loadSharesFirstPage (assetCode) {
      this.isSharesLoaded = false
      try {
        const response = await this.loadShares(assetCode)
        this.isSharesLoaded = true
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isSharesLoadFailed = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.shares-history__list-wrp {
  overflow-x: auto;
  width: 100%;
}
</style>
