<template>
  <div class="assets-renderer">
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
            :balance="selectedBalance"
            :kyc-required-asset-type="kycRequiredAssetType"
            :security-asset-type="securityAssetType"
          />

          <div class="assets-renderer__actions">
            <asset-actions
              :asset="selectedAsset"
              :is-account-unverified="isAccountUnverified"
              :is-account-general="isAccountGeneral"
              :is-account-us-accredited="isAccountUsAccredited"
              :is-account-us-verified="isAccountUsVerified"
              :is-account-corporate="isAccountCorporate"
              :kyc-required-asset-type="kycRequiredAssetType"
              :security-asset-type="securityAssetType"
              @update-click="isUpdateMode = true"
              @balance-added="loadAssets() || (isDrawerShown = false)"
            />
          </div>
        </template>
      </drawer>

      <div class="assets-renderer__asset-list-wrp">
        <div
          class="assets-renderer__asset-list"
        >
          <template v-for="asset in assets">
            <card-viewer
              :asset="asset"
              :balance="getAssetBalance(asset)"
              :key="asset.code"
              @click="selectAsset(asset)"
            />
          </template>
          <template v-for="index in itemsPerSkeletonLoader">
            <asset-skeleton-loader
              v-if="!isLoaded && !assets.length"
              :key="index"
            />
          </template>
        </div>

        <no-data-message
          v-if="isLoaded && !assets.length"
          icon-name="trending-up"
          :title="'assets.no-assets-title' | globalize"
          :message="'assets.no-assets-msg' | globalize"
        />
      </div>
    </template>

    <template v-if="isLoadFailed">
      <p class="assets-renderer__error-msg">
        {{ 'assets.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import NoDataMessage from '@/vue/common/NoDataMessage'

import CardViewer from '../../shared/components/card-viewer'
import AssetAttributesViewer from '../../shared/components/asset-attributes-viewer'
import AssetActions from './asset-actions'
import AssetSkeletonLoader from './asset-skeleton-loader'

import UpdateAssetFormModule from '@modules/update-asset-form'

import { mapGetters, mapActions } from 'vuex'
import { types } from '../store/types'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'assets-renderer',
  components: {
    Drawer,
    NoDataMessage,
    CardViewer,
    AssetAttributesViewer,
    AssetActions,
    UpdateAssetFormModule,
    AssetSkeletonLoader,
  },

  props: {
    isAccountUnverified: {
      type: Boolean,
      required: true,
    },
    isAccountUsVerified: {
      type: Boolean,
      required: true,
    },
    isAccountUsAccredited: {
      type: Boolean,
      required: true,
    },
    isAccountGeneral: {
      type: Boolean,
      required: true,
    },
    isAccountCorporate: {
      type: Boolean,
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
    ...mapGetters({
      assets: vuexTypes.assets,
      accountBalances: vuexTypes.accountBalances,
    }),
    ...mapGetters('asset-explorer', {
      kycRequiredAssetType: types.kycRequiredAssetType,
      securityAssetType: types.securityAssetType,
    }),

    selectedBalance (asset) {
      const record = this.accountBalances
        .find(item => item.asset.code === this.selectedAsset.code)
      return record ? record.balance : ''
    },
  },

  async created () {
    try {
      await this.loadAssets()
      this.isLoaded = true
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback()
    }
  },

  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),

    selectAsset (asset) {
      this.selectedAsset = asset
      this.isUpdateMode = false
      this.isDrawerShown = true
    },

    getAssetBalance (asset) {
      const balanceRecord = this.accountBalances
        .find(b => b.asset.code === asset.code)
      return balanceRecord ? balanceRecord.balance : ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';

$asset-card-margin: 0.75rem;
$media-small-height: 460px;

.assets-renderer__actions {
  margin-top: 4.9rem;

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
}

.assets-renderer__asset-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -$asset-card-margin;
}
</style>
