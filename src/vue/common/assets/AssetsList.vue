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
    <div class="assets-list__cards">
      <a
        class="assets-list__card"
        v-for="asset in assetRecords"
        :key="asset.code"
        @click="selectAsset(asset)"
      >
        <div class="assets-list__card-header">
          <asset-logo
            class="assets-list__card-logo"
            :asset-code="asset.code"
            :logo-url="asset.logoUrl(config.FILE_STORAGE)"
          />
        </div>
        <div class="assets-list__card-info">
          <p :title="asset.code" class="assets-list__card-code">
            {{ asset.code }}
          </p>
          <p :title="asset.name" class="assets-list__card-name">
            {{ asset.name || asset.code }}
          </p>
          <p
            v-if="asset.balance.value"
            class="assets-list__card-balance"
            :title="
              'assets-list.list-item-balance-line' |
                globalize({ value: asset.balance })
            "
          >
            <!-- eslint-disable-next-line max-len -->
            {{ 'assets-list.list-item-balance-line' | globalize({ value: asset.balance }) }}
          </p>
          <p
            v-else
            class="assets-list__card-balance assets-list__card-no-balance"
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

import { mapGetters } from 'vuex'
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
  methods: {
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

$asset-card-header-height: 8.5rem;
$asset-card-margin: 0.75rem;

$media-desktop: 1130px;
$media-small-desktop: 960px;

// width in percentage
@mixin asset-card-width ($width) {
  flex: 0 1 calc(#{$width}% - (#{$asset-card-margin} * 2));
  max-width: calc(#{$width}% - (#{$asset-card-margin} * 2));
}

.assets-list__cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -$asset-card-margin;
}

.assets-list__card {
  min-height: 19rem;
  cursor: pointer;
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-field-shadow;
  background-color: $col-asset-card-background;
  margin: $asset-card-margin;

  @include asset-card-width(25);

  @include respond-to-custom($media-desktop) {
    @include asset-card-width(33);
  }

  @include respond-to-custom($media-small-desktop) {
    @include asset-card-width(50);
  }

  @include respond-to-custom($sidebar-hide-bp) {
    @include asset-card-width(33);
  }

  @include respond-to(small) {
    @include asset-card-width(50);
  }

  @include respond-to(xsmall) {
    @include asset-card-width(100);
  }
}

.assets-list__card-header {
  border-radius: .4rem .4rem 0rem 0rem;
  height: $asset-card-header-height;
  background-color: $col-asset-card-header-background;
  padding-top: 1.5rem;
}

.assets-list__card-logo {
  margin: 0 auto;
}

.assets-list__card-info {
  padding: 1.6rem 2rem;
  height: calc(100% - #{$asset-card-header-height});
  display: flex;
  flex-direction: column;
}

.assets-list__card-code {
  font-size: 1.8rem;
  font-weight: bold;
  color: $col-asset-card-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
}

.assets-list__card-name {
  margin-top: 0.2rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-asset-card-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
}

.assets-list__card-balance {
  margin-top: 1.2rem;
  font-size: 1.2rem;
  line-height: 1.5;
  color: $col-asset-card-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: auto;
}

.assets-list__card-no-balance {
  color: $col-asset-card-text-secondary;
}
</style>
