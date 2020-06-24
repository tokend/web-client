<template>
  <div class="balance-explorer">
    <template>
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

          <button
            v-if="selectedBalance.asset.owner === accountId"
            v-ripple
            class="app__button-raised balance-explorer__update-btn"
            @click="showUpdateForm"
          >
            {{ 'assets.update-btn' | globalize }}
          </button>
        </template>
      </drawer>

      <div class="balance-explorer__asset-list-wrp">
        <div class="balance-explorer__asset-list">
          <template v-for="item in accountBalances">
            <card-viewer
              :asset="item.asset"
              :balance="item.balance"
              :key="item.id"
              @click="selectBalance(item)"
            />
          </template>
          <template v-for="index in itemsPerSkeletonLoader">
            <balance-skeleton-loader
              v-if="!isLoaded && !accountBalances.length"
              :key="index"
            />
          </template>
        </div>

        <no-data-message
          v-if="isLoaded && !accountBalances.length"
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

import CardViewer from '../shared/components/card-viewer'
import AssetAttributesViewer from '../shared/components/asset-attributes-viewer'
import BalanceSkeletonLoader from './components/balance-skeleton-loader'

import AssetForm from '@modules/asset-form'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'
import UpdateList from '@/vue/mixins/update-list.mixin'
import { AssetFormer } from '@/js/formers/AssetFormer'

export default {
  name: 'balance-explorer',
  components: {
    Drawer,
    NoDataMessage,
    CardViewer,
    AssetAttributesViewer,
    AssetForm,
    BalanceSkeletonLoader,
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
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.kvAssetTypeKycRequired,
      vuexTypes.kvAssetTypeSecurity,
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
