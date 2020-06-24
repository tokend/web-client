<template>
  <div class="my-assets-explorer">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isAssetFormShown">
          <template slot="heading">
            {{ 'assets.update-drawer-title' | globalize }}
          </template>

          <asset-form
            :former="former"
            @submitted="onAssetUpdate"
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
              @click="showUpdateForm"
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
          v-if="accountOwnedAssetsBalances.length"
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

import AssetForm from '@/vue/forms/AssetForm'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { ErrorHandler } from '@/js/helpers/error-handler'
import UpdateList from '@/vue/mixins/update-list.mixin'
import { AssetFormer } from '@/js/formers/AssetFormer'

export default {
  name: 'my-assets-explorer',
  components: {
    Drawer,
    LoadSpinner,
    NoDataMessage,
    CardViewer,
    AssetAttributesViewer,
    AssetForm,
    AssetSkeletonLoader,
  },
  mixins: [UpdateList],

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    isDrawerShown: false,
    isAssetFormShown: false,
    selectedBalance: {
      asset: {},
    },
    former: new AssetFormer(),
    itemsPerSkeletonLoader: 3,
    vueRoutes,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.kvAssetTypeKycRequired,
      vuexTypes.kvAssetTypeSecurity,
      vuexTypes.defaultQuoteAsset,
      vuexTypes.accountOwnedAssetsBalances,
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
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    selectBalance (balance) {
      this.selectedBalance = balance
      this.isAssetFormShown = false
      this.isDrawerShown = true
    },

    showUpdateForm () {
      this.former = new AssetFormer(this.selectedBalance.asset)
      this.isAssetFormShown = true
    },

    onAssetUpdate () {
      this.isDrawerShown = false
      this.emitUpdateList('assets:updateList')
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
