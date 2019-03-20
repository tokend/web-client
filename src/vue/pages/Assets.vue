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
          {{ 'assets-page.create-asset-button' | globalize }}
        </button>
      </template>
    </top-bar>
    <drawer :is-shown.sync="isAssetDrawerShown">
      <template slot="heading">
        {{ 'assets-page.create-asset-title' | globalize }}
      </template>
      <asset-create-form @close="isAssetDrawerShown = false" />
    </drawer>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import AssetCreateForm from '@/vue/forms/AssetCreateForm'

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
    vueRoutes,
    isAssetDrawerShown: false,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
      isAccountCorporate: vuexTypes.isAccountCorporate,
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
