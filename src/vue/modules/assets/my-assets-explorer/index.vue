<template>
  <div class="my-assets-explorer">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'assets.update-drawer-title' | globalize }}
          </template>

          <update-asset-form-module
            :asset-code="selectedBalance.asset.code"
            @close="isDrawerShown = false"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'assets.details-drawer-title' | globalize }}
          </template>
          <asset-attributes-viewer
            :asset="selectedBalance.asset"
            :balance="selectedBalance.balance"
            :kyc-required-asset-type="kvAssetTypeKycRequired"
            :security-asset-type="kvAssetTypeSecurity"
          />

          <div class="my-assets-explorer__actions-wrapper">
            <button
              v-ripple
              class="app__button-raised my-assets-explorer__update-btn"
              @click="isUpdateMode = true"
            >
              {{ 'assets.update-btn' | globalize }}
            </button>

            <router-link
              :to="vueRoutes.registerOfShares"
              tag="button"
              class="app__button-flat my-assets-explorer__view-shares-btn"
            >
              {{ 'assets.view-shares-btn' | globalize }}
            </router-link>
          </div>
        </template>
      </drawer>

      <div class="my-assets-explorer__asset-list-wrp">
        <div
          v-if="assets.length"
          class="my-assets-explorer__asset-list"
        >
          <template v-for="item in accountOwnedAssetsBalances">
            <card-viewer
              :asset="item.asset"
              :balance="item.balance"
              :key="item.id"
              @click="selectBalance(item)"
            />
          </template>
          <template v-for="index in itemsPerSkeletonLoader">
            <asset-skeleton-loader
              v-if="!isLoaded && !accountOwnedAssetsBalances.length"
              :key="index"
            />
          </template>
        </div>

        <no-data-message
          v-else
          icon-name="trending-up"
          :title="'assets.no-assets-title' | globalize"
          :message="'assets.no-created-assets-msg' | globalize"
        />
      </div>
    </template>

    <template v-else-if="isLoadFailed">
      <p class="my-assets-explorer__error-msg">
        {{ 'assets.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="assets.balances-loading-msg" />
    </template>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import CardViewer from '../shared/components/card-viewer'
import AssetAttributesViewer from '../shared/components/asset-attributes-viewer'
import AssetSkeletonLoader from './components/asset-skeleton-loader'

import UpdateAssetFormModule from '@modules/update-asset-form'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'my-assets-explorer',
  components: {
    Drawer,
    LoadSpinner,
    NoDataMessage,
    CardViewer,
    AssetAttributesViewer,
    UpdateAssetFormModule,
    AssetSkeletonLoader,
  },
  props: {
    defaultQuoteAsset: {
      type: String,
      required: true,
    },
  },
  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    isDrawerShown: false,
    isUpdateMode: false,
    selectedBalance: {
      asset: {},
    },
    itemsPerSkeletonLoader: 3,
    vueRoutes,
  }),

  computed: {
    ...mapGetters({
      assets: vuexTypes.balancesAssets,
      ownedAssets: vuexTypes.ownedAssets,
      accountBalances: vuexTypes.accountBalances,
      accountOwnedAssetsBalances: vuexTypes.accountOwnedAssetsBalances,
    }),

    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.kvAssetTypeKycRequired,
      vuexTypes.kvAssetTypeSecurity,
    ]),
  },

  async created () {
    await this.load()
  },

  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async load () {
      try {
        await this.loadAccountBalances(this.defaultQuoteAsset)
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    selectBalance (balance) {
      this.selectedBalance = balance
      this.isUpdateMode = false
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';

$asset-card-margin: 0.75rem;

$media-small-height: 460px;

.my-assets-explorer__asset-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -$asset-card-margin;
}

.my-assets-explorer__update-btn {
  max-width: 18rem;
  width: 100%;
}

.my-assets-explorer__actions-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 4.9rem;

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
}
</style>
