<template>
  <div class="balance-explorer">
    <template>
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'assets.update-drawer-title' | globalize }}
          </template>

          <asset-update-form-module
            :asset-code="selectedAsset.code"
            :wallet="wallet"
            :config="config"
            @close="isDrawerShown = false"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'assets.details-drawer-title' | globalize }}
          </template>
          <asset-attributes-viewer
            :asset="selectedAsset"
            :storage-url="config.storageURL"
            :kyc-required-asset-type="kycRequiredAssetType"
          />

          <button
            v-if="selectedAsset.owner === wallet.accountId"
            v-ripple
            class="app__button-raised balance-explorer__update-btn"
            @click="isUpdateMode = true"
          >
            {{ 'assets.update-btn' | globalize }}
          </button>
        </template>
      </drawer>

      <div class="balance-explorer__asset-list-wrp">
        <div
          class="balance-explorer__asset-list"
        >
          <template v-for="asset in assets">
            <card-viewer
              :asset="asset"
              :storage-url="config.storageURL"
              :key="asset.code"
              @click="selectAsset(asset)"
            />
          </template>
          <template v-for="item in itemsPerSkeletonLoader">
            <skeleton-loader
              :key="item"
              v-if="!isLoaded && !assets.length"
              template="cardViewer"
            />
          </template>
        </div>

        <no-data-message
          v-if="isLoaded && !assets.length"
          icon-name="trending-up"
          :title="'assets.no-balances-title' | globalize"
          :message="'assets.no-balances-msg' | globalize"
        />
      </div>
    </template>

    <template v-if="isLoadFailed">
      <p class="balance-explorer__error-msg">
        {{ 'assets.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

import CardViewer from '../shared/components/card-viewer'
import AssetAttributesViewer from '../shared/components/asset-attributes-viewer'

import AssetUpdateFormModule from '@modules/update-asset-form'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'balance-explorer',
  components: {
    Drawer,
    NoDataMessage,
    CardViewer,
    AssetAttributesViewer,
    AssetUpdateFormModule,
    SkeletonLoader,
  },
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
    * @property config - the config for component to use
    * @property config.horizonURL - the url of horizon server (without version)
    * @property config.storageURL - the url of storage server
    */
    config: {
      type: Object,
      required: true,
    },
  },
  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    isDrawerShown: false,
    isUpdateMode: false,
    selectedAsset: {},
    itemsPerSkeletonLoader: 3,
  }),

  computed: {
    ...mapGetters('balance-explorer', {
      assets: types.assets,
      kycRequiredAssetType: types.kycRequiredAssetType,
    }),
  },

  async created () {
    initApi(this.wallet, this.config)
    this.setAccountId(this.wallet.accountId)
    await this.load()
  },

  methods: {
    ...mapMutations('balance-explorer', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),

    ...mapActions('balance-explorer', {
      loadAccountBalances: types.LOAD_ACCOUNT_BALANCES,
      loadKycRequiredAssetType: types.LOAD_KYC_REQUIRED_ASSET_TYPE,
    }),

    async load () {
      try {
        await this.loadAccountBalances()
        await this.loadKycRequiredAssetType()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    selectAsset (asset) {
      this.selectedAsset = asset
      this.isUpdateMode = false
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/mixins";

$asset-card-margin: 0.75rem;

$media-small-height: 460px;

.balance-explorer__asset-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -$asset-card-margin;
}

.balance-explorer__update-btn {
  margin-top: 4.9rem;
  max-width: 18rem;
  width: 100%;

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
}
</style>
