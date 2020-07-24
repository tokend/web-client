<template>
  <div class="asset-explorer">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <p class="asset-explorer__error-msg">
          {{ 'assets.loading-error-msg' | globalize }}
        </p>
      </template>
      <template v-else>
        <template v-if="assets.length">
          <card-list
            v-slot="{ item }"
            :list="assets"
          >
            <asset-card
              :asset="item"
            />
          </card-list>
        </template>
        <template v-else>
          <no-data-message
            icon-name="trending-up"
            :title="'assets.no-assets-title' | globalize"
            :message="'assets.no-assets-msg' | globalize"
          />
        </template>
      </template>
    </template>
    <template v-else>
      <skeleton-cards-loader />
    </template>
  </div>
</template>

<script>
import CardList from '@/vue/common/CardList'
import NoDataMessage from '@/vue/common/NoDataMessage'
import AssetCard from './components/asset-card'
import UpdateList from '@/vue/mixins/update-list.mixin'
import SkeletonCardsLoader from '@/vue/common/skeleton-loader/SkeletonCardsLoader'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'asset-explorer',
  components: {
    CardList,
    NoDataMessage,
    SkeletonCardsLoader,
    AssetCard,
  },

  mixins: [UpdateList],

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.assets,
      vuexTypes.assetsByOwner,
      vuexTypes.accountBalances,
      vuexTypes.accountBalanceByCode,
    ]),
  },

  async created () {
    await this.load()
  },

  beforeDestroy () {
    this.resetUpdateListEvent('assets:updateList')
  },

  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),

    async load () {
      try {
        await this.loadAccountBalances()
        await this.loadAssets()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback()
      }
      this.listenUpdateList('assets:updateList', this.loadAssets)
    },
  },
}
</script>
