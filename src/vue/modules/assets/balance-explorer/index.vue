<template>
  <div class="balance-explorer">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <p class="balance-explorer__error-msg">
          {{ 'assets.loading-error-msg' | globalize }}
        </p>
      </template>
      <template v-else>
        <template v-if="accountBalances.length">
          <div class="balance-explorer__card-list">
            <template v-for="item in accountBalances">
              <asset-card
                :asset="item.asset"
                @update-asset="updateAssetsList"
                :key="item.asset.id"
              />
            </template>
          </div>
        </template>
        <template v-else>
          <no-data-message
            icon-name="trending-up"
            :title="'assets.no-balances-title' | globalize"
            :message="'assets.no-balances-msg' | globalize"
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
import NoDataMessage from '@/vue/common/NoDataMessage'
import AssetCard from '@/vue/modules/assets/shared/components/asset-card'
import UpdateList from '@/vue/mixins/update-list.mixin'
import SkeletonCardsLoader from '@/vue/common/skeleton-loader/SkeletonCardsLoader'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'balance-explorer',
  components: {
    AssetCard,
    NoDataMessage,
    SkeletonCardsLoader,
  },

  mixins: [UpdateList],

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.defaultQuoteAsset,
      vuexTypes.accountBalances,
    ]),
  },

  async created () {
    await this.load()
    this.listenUpdateList('assets:updateList', this.load)
  },

  beforeDestroy () {
    this.resetUpdateListEvent('assets:updateList')
  },

  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async load () {
      try {
        await this.loadAccountBalances(this.defaultQuoteAsset)
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isLoaded = true
    },

    updateAssetsList () {
      this.emitUpdateList('assets:updateList')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';

.balance-explorer__card-list {
  display: grid;
  grid-gap: $card-list-grid-gap;
  grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
}
</style>
