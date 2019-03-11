<template>
  <div class="healthcare-page">
    <top-bar>
      <template slot="main">
        <router-link
          :to="vueRoutes.documentExplorer"
        >
          <span>
            {{ 'healthcare-page.explore-documents-title' | globalize }}
          </span>
        </router-link>
      </template>

      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isIssuanceDrawerShown = true"
        >
          {{ 'healthcare-page.create-document' | globalize }}
        </button>
      </template>
    </top-bar>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { vueRoutes } from '@/vue-router/routes'

import config from '@/config'

export default {
  name: 'healthcare-page',
  components: {
    TopBar,
  },

  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
    vueRoutes,
  }),

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>

<style lang="scss" scoped>

</style>
