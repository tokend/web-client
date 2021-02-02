<template>
  <div>
    <top-bar>
      <!-- <template slot="main">
        <router-link :to="vueRoutes.assetsExplore">
          <span>{{ 'assets-page.explore-title' | globalize }}</span>
        </router-link>
        <router-link :to="vueRoutes.balances">
          <span>{{ 'assets-page.balances-title' | globalize }}</span>
        </router-link>
        <router-link
          v-if="isAccountCorporate"
          :to="vueRoutes.myAssets"
        >
          <span>{{ 'assets-page.my-assets-title' | globalize }}</span>
        </router-link>
      </template>
      -->
      <template
        slot="extra"
      >
        <button
          v-ripple
          class="assets-page__create-btn app__button-raised"
          @click="isAssetDrawerShown = true"
        >
          Deposit
        </button>
        <button
          v-ripple
          class="assets-page__create-btn app__button-raised"
          @click="isAssetDrawerShown = true"
        >
          Redemption
        </button>
      </template>
    </top-bar>

    <template v-if="isAccountCorporate">
      <drawer :is-shown.sync="isAssetDrawerShown">
        <template slot="heading">
          {{ 'assets-page.create-asset-title' | globalize }}
        </template>
        <asset-form @submitted="onAssetFormSubmit()" />
      </drawer>
    </template>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import AssetForm from '@/vue/forms/AssetForm'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import UpdateList from '@/vue/mixins/update-list.mixin'

export default {
  name: 'assets',
  components: {
    TopBar,
    Drawer,
    AssetForm,
  },
  mixins: [UpdateList],
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
  methods: {
    onAssetFormSubmit () {
      this.isAssetDrawerShown = false
      this.emitUpdateList('assets:updateList')
    },
  },
}
</script>

<style lang="scss">
.assets-page__btn-icon {
  display: flex;
  font-size: 1.8rem;
  margin-right: 0.5rem;
  margin-top: -0.4rem;
}
</style>
