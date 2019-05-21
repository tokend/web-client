<template>
  <div class="balance-explorer">
    <template>
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'assets.update-drawer-title' | globalize }}
          </template>

          <update-asset-form-module
            :asset-code="selectedAsset.code"
            @close="isDrawerShown = false"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'assets.details-drawer-title' | globalize }}
          </template>
          <asset-attributes-viewer
            :asset="selectedAsset"
            :kyc-required-asset-type="kycRequiredAssetType"
            :security-asset-type="securityAssetType"
          />

          <button
            v-if="selectedAsset.owner === accountId"
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

import UpdateAssetFormModule from '@modules/update-asset-form'

import { mapActions, mapGetters } from 'vuex'
import { types } from './store/types'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'balance-explorer',
  components: {
    Drawer,
    NoDataMessage,
    CardViewer,
    AssetAttributesViewer,
    SkeletonLoader,
    UpdateAssetFormModule,
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
    selectedAsset: {},
    itemsPerSkeletonLoader: 3,
  }),

  computed: {
    ...mapGetters('balance-explorer', {
      assets: types.assets,
      kycRequiredAssetType: types.kycRequiredAssetType,
      securityAssetType: types.securityAssetType,
    }),
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },

  async created () {
    await this.load()
  },

  methods: {
    ...mapActions('balance-explorer', {
      loadAccountBalances: types.LOAD_ACCOUNT_BALANCES,
      loadKycRequiredAssetType: types.LOAD_KYC_REQUIRED_ASSET_TYPE,
      loadSecurityAssetType: types.LOAD_SECURITY_ASSET_TYPE,
    }),

    async load () {
      try {
        await this.loadAccountBalances(this.defaultQuoteAsset)
        await this.loadKycRequiredAssetType()
        await this.loadSecurityAssetType()
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
@import '~@scss/mixins';

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
