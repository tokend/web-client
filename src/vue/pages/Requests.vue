<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.requests.assetCreation">
          <span>{{ 'requests-page.asset-creation-title' | globalize }}</span>
        </router-link>

        <router-link :to="vueRoutes.requests.saleCreation">
          <span>{{ 'requests-page.sale-creation-title' | globalize }}</span>
        </router-link>

        <router-link :to="vueRoutes.requests.preIssuanceUpload">
          <span>
            {{ 'requests-page.pre-issuance-upload-title' | globalize }}
          </span>
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
