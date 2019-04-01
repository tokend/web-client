<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link
          :to="vueRoutes.assetsExplore"
        >
          <span>{{ 'assets-page.explore-title' | globalize }}</span>
        </router-link>
        <router-link
          :to="vueRoutes.balances"
        >
          <span>{{ 'assets-page.balances-title' | globalize }}</span>
        </router-link>
      </template>
      <template
        slot="extra"
        v-if="getModule().canRenderSubmodule(CreateAssetFormModule)"
      >
        <button
          v-ripple
          class="create-asset-btn"
          @click="isAssetDrawerShown = true"
        >
          {{ 'assets-page.create-asset-button' | globalize }}
        </button>
      </template>
    </top-bar>

    <template v-if="getModule().canRenderSubmodule(CreateAssetFormModule)">
      <drawer :is-shown.sync="isAssetDrawerShown">
        <template slot="heading">
          {{ 'assets-page.create-asset-title' | globalize }}
        </template>

        <submodule-importer
          :submodule="getModule().getSubmodule(CreateAssetFormModule)"
          @close="isAssetDrawerShown = false"
        />
      </drawer>
    </template>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import SubmoduleImporter from '@/modules-arch/submodule-importer'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { CreateAssetFormModule } from '@modules/create-asset-form/module'

export default {
  name: 'assets',
  components: {
    TopBar,
    Drawer,
    SubmoduleImporter,
  },
  data: _ => ({
    vueRoutes,
    CreateAssetFormModule,
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
