<template>
  <div class="atomic-swaps">
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.atomicSwapsExplore">
          <span>{{ 'atomic-swaps.explore-atomic-swaps' | globalize }}</span>
        </router-link>
      </template>
      <template slot="extra">
        <template
          slot="extra"
          v-if="getModule().canRenderSubmodule(CreateAtomicSwapFormModule)"
        >
          <button
            v-ripple
            class="app__button-raised"
            @click="isAtomicSwapsCreateDrawerShown = true"
          >
            {{ 'atomic-swaps.create-atomic-swap-bth' | globalize }}
          </button>
        </template>
      </template>
    </top-bar>

    <drawer
      :is-shown.sync="isAtomicSwapsCreateDrawerShown"
      :close-by-click-outside="false"
    >
      <template slot="heading">
        {{ 'atomic-swaps.new-atomic-swap' | globalize }}
      </template>

      <submodule-importer
        :submodule="getModule().getSubmodule(CreateAtomicSwapFormModule)"
      />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import { vueRoutes } from '@/vue-router/routes'
import Drawer from '@/vue/common/Drawer'
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { CreateAtomicSwapFormModule } from '@/vue/modules/create-atomic-swap-form/module'

export default {
  name: 'atomic-swaps',
  components: {
    TopBar,
    Drawer,
    SubmoduleImporter,
  },
  data: () => ({
    isAtomicSwapsCreateDrawerShown: false,
    vueRoutes,
    CreateAtomicSwapFormModule,
  }),
}
</script>

<style lang="scss" scoped>
</style>
