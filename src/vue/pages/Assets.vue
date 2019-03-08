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
          @click="isAssetDrawerShown = true"
        >
          {{ 'assets-page.create-asset-title' | globalize }}
        </button>

        <button
          v-ripple
          class="create-asset-btn"
          @click="isAssetSaleDrawerShown = true"
        >
          {{ 'Asset-Sale' }}
        </button>
      </template>
    </top-bar>
    <drawer :is-shown.sync="isAssetDrawerShown">
      <template slot="heading">
        {{ 'assets-page.create-asset-title' | globalize }}
      </template>
      <asset-create-form @close="isAssetDrawerShown = false" />
    </drawer>
    <drawer :is-shown.sync="isAssetSaleDrawerShown">
      <template slot="heading">
        {{ 'Asset Sale' }}
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
import AssetCreateForm from '@/vue/forms/AssetCreateForm'

import AssetSaleModule from '@modules/create-asset-sale'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'assets',
  components: {
    TopBar,
    Drawer,
    AssetCreateForm,
    AssetSaleModule,
  },
  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
    vueRoutes,
    isAssetDrawerShown: false,
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
