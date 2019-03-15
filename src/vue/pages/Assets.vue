<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link
          v-ripple
          :to="vueRoutes.assetsExplore"
        >
          <span>{{ 'assets-page.explore-title' | globalize }}</span>
        </router-link>
        <router-link
          v-ripple
          :to="vueRoutes.balances"
        >
          <span>{{ 'assets-page.balances-title' | globalize }}</span>
        </router-link>
      </template>
      <template v-if="isAccountCorporate" slot="extra">
        <button
          v-ripple
          class="create-asset-btn"
          @click="isAssetSaleDrawerShown = true"
        >
          {{ 'assets-page.new-asset' | globalize }}
        </button>
      </template>
    </top-bar>
    <drawer :is-shown.sync="isAssetSaleDrawerShown">
      <template slot="heading">
        {{ 'assets-page.new-asset' | globalize }}
      </template>
      <asset-sale-module
        @close="isAssetSaleDrawerShown = false"
        :config="config"
        :wallet="wallet"
        :account-id="accountId"
      />
    </drawer>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'

import AssetSaleModule from '@modules/create-opportunity'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'assets',
  components: {
    TopBar,
    Drawer,
    AssetSaleModule,
  },
  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
    vueRoutes,
    isAssetSaleDrawerShown: false,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
      accountId: vuexTypes.accountId,
      isAccountCorporate: vuexTypes.isAccountCorporate,
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.create-asset-btn {
  @include button-raised;
}
</style>
