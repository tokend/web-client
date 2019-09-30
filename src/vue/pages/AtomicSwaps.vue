<template>
  <div class="atomic-swaps">
    <top-bar>
      <template slot="extra">
        <button
          v-if="isAccountCorporate && !isCustomerUiShown"
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

      <create-atomic-swap-form
        @created-atomic-swap="closeDrawerAndUpdateList()"
      />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import CreateAtomicSwapForm from '@/vue/modules/create-atomic-swap-form'
import UpdateList from '@/vue/mixins/update-list.mixin'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'atomic-swaps',
  components: {
    TopBar,
    Drawer,
    CreateAtomicSwapForm,
  },

  mixins: [UpdateList],

  data: () => ({
    isAtomicSwapsCreateDrawerShown: false,
    vueRoutes,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
      vuexTypes.isCustomerUiShown,
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
