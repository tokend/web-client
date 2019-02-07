<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link
          v-ripple
          :to="vueRoutes.requests.assetCreation"
        >
          <span>{{ 'requests-page.token-creation-title' | globalize }}</span>
        </router-link>
        <router-link
          v-ripple
          :to="vueRoutes.requests.fundCreation"
        >
          <span>{{ 'requests-page.fund-creation-title' | globalize }}</span>
        </router-link>
      </template>
    </top-bar>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'requests',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
  }),
}
</script>

<style lang="scss" scoped>
</style>
