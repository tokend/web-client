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
          class="assets-page__create-btn app__button-raised"
          @click="isAssetDrawerShown = true"
        >
          <i class="mdi mdi-plus assets-page__btn-icon" />
          <span>
            {{ 'assets-page.create-btn' | globalize }}
          </span>
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
          :storage-url="storageUrl"
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

import config from '@/config'

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
    storageUrl: config.FILE_STORAGE,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),
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
