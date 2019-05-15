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
            :storage-url="storageUrl"
            @close="isDrawerShown = false"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'assets.details-drawer-title' | globalize }}
          </template>

          <asset-attributes-viewer
            :asset="selectedAsset"
            :storage-url="storageUrl"
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
              @balance-added="initFirstPageLoader() || (isDrawerShown = false)"
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
              :storage-url="storageUrl"
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

    <div class="assets-renderer__collection-loader-wrp">
      <collection-loader
        v-show="isLoaded && assets.length"
        :first-page-loader="firstPageLoader"
        :page-limit="ASSETS_PER_PAGE"
        @first-page-load="setAssets"
        @next-page-load="concatAssets"
      />
    </div>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

import CardViewer from '../../shared/components/card-viewer'
import AssetAttributesViewer from '../../shared/components/asset-attributes-viewer'
import AssetActions from './asset-actions'

import UpdateAssetFormModule from '@modules/update-asset-form'

import { mapGetters, mapActions, mapMutations } from 'vuex'
import { types } from '../store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

const ASSETS_PER_PAGE = 12

export default {
  name: 'assets-renderer',
  components: {
    Drawer,
    NoDataMessage,
    CollectionLoader,
    CardViewer,
    AssetAttributesViewer,
    AssetActions,
    SkeletonLoader,
    UpdateAssetFormModule,
  },

  props: {
    storageUrl: {
      type: String,
      required: true,
    },
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
    firstPageLoader: _ => {},
    ASSETS_PER_PAGE,
    itemsPerSkeletonLoader: 3,
  }),

  computed: {
    ...mapGetters('asset-explorer', {
      assets: types.assets,
      kycRequiredAssetType: types.kycRequiredAssetType,
      securityAssetType: types.securityAssetType,
    }),
  },

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    ...mapMutations('asset-explorer', {
      setAssets: types.SET_ASSETS,
      concatAssets: types.CONCAT_ASSETS,
    }),

    ...mapActions('asset-explorer', {
      loadAssets: types.LOAD_ASSETS,
    }),

    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadAssetsPage()
    },

    async loadAssetsPage () {
      this.isLoaded = false
      try {
        const response = await this.loadAssets({
          page: { limit: ASSETS_PER_PAGE },
        })
        this.isLoaded = true
        return response
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback()
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

.assets-renderer__collection-loader-wrp {
  margin-top: 1.5rem;
}

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
