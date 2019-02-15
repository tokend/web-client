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
      <template
        v-if="account.accountTypeI === ACCOUNT_TYPES.syndicate"
        slot="extra"
      >
        <button
          v-ripple
          class="create-asset-btn"
          @click="isAssetDrawerShown = true"
        >
          {{ 'assets-page.create-token-btn' | globalize }}
        </button>
      </template>
    </top-bar>
    <drawer :is-shown.sync="isAssetDrawerShown">
      <template slot="heading">
        {{ 'assets-page.create-token-btn' | globalize }}
      </template>
      <asset-create-form />
    </drawer>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import AssetCreateForm from '@/vue/forms/AssetCreateForm'

import { ACCOUNT_TYPES } from '@tokend/js-sdk'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'assets',
  components: {
    TopBar,
    Drawer,
    AssetCreateForm,
  },
  data: _ => ({
    ACCOUNT_TYPES,
    vueRoutes,
    isAssetDrawerShown: false,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
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
