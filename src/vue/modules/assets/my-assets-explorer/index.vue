<template>
  <div class="my-assets-explorer">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <p class="my-assets-explorer__error-msg">
          {{ 'assets.loading-error-msg' | globalize }}
        </p>
      </template>
      <template v-else>
        <template v-if="accountOwnedAssetsBalances.length">
          <div class="my-assets-explorer__card-list">
            <template v-for="item in accountOwnedAssetsBalances">
              <asset-card
                :asset="item.asset"
                @update-asset="updateAssetsList"
                :key="item.id"
              />
            </template>
          </div>
        </template>
        <template v-else>
          <no-data-message
            icon-name="trending-up"
            :title="'assets.no-assets-title' | globalize"
            :message="'assets.no-created-assets-msg' | globalize"
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
import SkeletonCardsLoader from '@/vue/common/skeleton-loader/SkeletonCardsLoader'
import AssetCard from '@/vue/modules/assets/shared/components/asset-card'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import UpdateList from '@/vue/mixins/update-list.mixin'

export default {
  name: 'my-assets-explorer',
  components: {
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
      vuexTypes.accountId,
      vuexTypes.defaultQuoteAsset,
      vuexTypes.accountOwnedAssetsBalances,
      vuexTypes.accountBalances,
      vuexTypes.assets,
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

.my-assets-explorer__card-list {
  display: grid;
  grid-gap: $card-list-grid-gap;
  grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
}
</style>
