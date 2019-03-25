<template>
  <div class="assets-list">
    <drawer :is-shown.sync="isDetailsDrawerShown">
      <template slot="heading">
        <template v-if="isUpdateMode">
          {{ 'assets-list.update-asset-title' | globalize }}
        </template>
        <template v-else>
          {{ 'assets-list.details-title' | globalize }}
        </template>
      </template>
      <asset-update-form
        v-if="isUpdateMode"
        :asset-record="selectedAsset"
        @close="isDetailsDrawerShown = false"
      />
      <asset-details
        v-else
        :asset="selectedAsset"
        @balance-added="refreshSelectedAsset"
        @update-ask="isUpdateMode = true"
      />
    </drawer>
    <div class="asset-cards">
      <a
        class="asset-card"
        v-for="asset in assetRecords"
        :key="asset.code"
        @click="selectAsset(asset)"
      >
        <div class="asset-card__header">
          <asset-logo
            class="asset-card__logo"
            :asset-code="asset.code"
            :logo-url="asset.logoUrl(config.FILE_STORAGE)"
          />
        </div>
        <div class="asset-card__info">
          <p class="asset-card__code">
            {{ asset.code }}
          </p>
          <p class="asset-card__name">
            {{ asset.name || asset.code }}
          </p>
          <p
            v-if="asset.balance.value"
            class="asset-card__balance"
          >
            <!-- eslint-disable-next-line max-len -->
            {{ 'assets-list.list-item-balance-line' | globalize({ value: asset.balance }) }}
          </p>
          <p
            v-else
            class="asset-card__balance asset-card__no-balance"
          >
            {{ 'assets-list.no-balance-msg' | globalize }}
          </p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import AssetDetails from '@/vue/pages/assets/AssetDetails'
import AssetLogo from '@/vue/common/assets/AssetLogo'
import AssetUpdateForm from '@/vue/forms/AssetUpdateForm'

import { AssetRecord } from '@/js/records/entities/asset.record'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'assets-list',
  components: {
    Drawer,
    AssetDetails,
    AssetLogo,
    AssetUpdateForm,
  },
  props: {
    assets: { type: Array, default: _ => [] },
  },
  data: _ => ({
    isDetailsDrawerShown: false,
    isUpdateMode: false,
    selectedAsset: null,
    config,
  }),
  computed: {
    ...mapGetters({
      accountBalances: vuexTypes.accountBalances,
    }),
    assetRecords () {
      return this.assets
        .map(asset => new AssetRecord(
          asset.record || asset,
          this.accountBalances
        ))
    },
  },
  async created () {
    await this.loadBalances()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    selectAsset (asset) {
      this.selectedAsset = asset
      this.isUpdateMode = false
      this.isDetailsDrawerShown = true
    },
    refreshSelectedAsset () {
      this.selectedAsset = this.assetRecords
        .find(asset => asset.code === this.selectedAsset.code)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.asset-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -.75rem;
}

.asset-card {
  flex: 0 1 calc(25% - 1.5rem);
  min-height: 19rem;
  cursor: pointer;
  border-radius: .4rem;
  box-shadow: 0 .5rem 1rem 0 $col-field-shadow;
  background-color: $col-asset-card-background;
  margin: .75rem;

  @include respond-to($medium) {
    flex: 0 1 calc(33% - 1.5rem);
  }

  @include respond-to($x-small) {
    flex: 0 1 calc(100% - 1.5rem);
  }
}

.asset-card__header {
  border-radius: .4rem .4rem 0rem 0rem;
  height: 8.5rem;
  background-color: $col-asset-card-header-background;
  padding-top: 1.5rem;
}

.asset-card__logo {
  margin: 0 auto;
}

.asset-card__info {
  padding: 1.6rem 2rem;
}

.asset-card__code {
  font-size: 1.8rem;
  font-weight: bold;
  color: $col-asset-card-text-primary;
}

.asset-card__name {
  margin-top: .2rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-asset-card-text-primary;
}

.asset-card__balance {
  margin-top: 1.2rem;
  font-size: 1.2rem;
  line-height: 1.5;
  color: $col-asset-card-text-primary;
}

.asset-card__no-balance {
  color: $col-asset-card-text-secondary;
}
</style>
