<template>
  <div class="balance-explorer">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'assets.update-drawer-title' | globalize }}
          </template>

          <asset-update-form
            :asset-record="selectedAsset"
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
          v-if="assets.length"
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
        </div>

        <no-data-message
          v-else
          icon-name="trending-up"
          title-id="assets.no-balances-title"
          message-id="assets.no-balances-msg"
        />
      </div>
    </template>

    <template v-else-if="isLoadFailed">
      <p class="balance-explorer__error-msg">
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
import AssetUpdateForm from '@/vue/forms/AssetUpdateForm'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'balance-explorer',
  components: {
    Drawer,
    LoadSpinner,
    NoDataMessage,
    CardViewer,
    AssetAttributesViewer,
    AssetUpdateForm,
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
    kycRequiredAssetType: {
      type: Number,
      required: true,
    },
  },
  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    isDrawerShown: false,
    isUpdateMode: false,
    selectedAsset: {},
  }),
  computed: {
    ...mapGetters('balance-explorer', {
      assets: types.assets,
    }),
  },
  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
  },

  methods: {
    ...mapMutations('balance-explorer', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),

    ...mapActions('balance-explorer', {
      loadAccountBalances: types.LOAD_ACCOUNT_BALANCES,
    }),

    async loadBalances () {
      try {
        await this.loadAccountBalances()
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
