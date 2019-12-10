<template>
  <div class="atomic-swaps">
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.atomicSwapsExplore">
          <span>{{ 'atomic-swaps.explore-atomic-swaps' | globalize }}</span>
        </router-link>
      </template>
      <template
        slot="extra"
        v-if="isAccountCorporate"
      >
        <button
          v-ripple
          class="app__button-raised"
          @click="isAtomicSwapsCreateDrawerShown = true"
        >
          {{ 'atomic-swaps.create-atomic-swap-bth' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer
      :is-shown.sync="isAtomicSwapsCreateDrawerShown"
      :close-by-click-outside="false"
    >
      <template slot="heading">
        {{ 'atomic-swaps.new-atomic-swap' | globalize }}
      </template>

      <create-atomic-swap-form-module
        @created-atomic-swap="closeDrawerAndUpdateList()"
      />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import { vueRoutes } from '@/vue-router/routes'
import Drawer from '@/vue/common/Drawer'
import CreateAtomicSwapFormModule from '@/vue/modules/create-atomic-swap-form'
import UpdateList from '@/vue/mixins/update-list.mixin'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'atomic-swaps',
  components: {
    TopBar,
    Drawer,
    CreateAtomicSwapFormModule,
  },

  mixins: [UpdateList],

  data: () => ({
    isAtomicSwapsCreateDrawerShown: false,
    vueRoutes,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
    ]),
  },

  beforeDestroy () {
    this.resetUpdateListEvent('atomicSwaps:updateList')
  },

  methods: {
    closeDrawerAndUpdateList () {
      this.isAtomicSwapsCreateDrawerShown = false
      this.emitUpdateList('atomicSwaps:updateList')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
