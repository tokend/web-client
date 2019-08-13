<template>
  <div class="businesses-page">
    <template>
      <top-bar>
        <template slot="main">
          <!-- eslint-disable-next-line max-len -->
          <template v-if="getModule().canRenderSubmodule(BusinessesMyPageModule)">
            <router-link :to="vueRoutes.myBusinesses">
              <span>{{ 'businesses.my-tab' | globalize }}</span>
            </router-link>
          </template>
          <!-- eslint-disable-next-line max-len -->
          <template v-if="getModule().canRenderSubmodule(BusinessesAllPageModule)">
            <router-link :to="vueRoutes.allBusinesses">
              <span>{{ 'businesses.all-tab' | globalize }}</span>
            </router-link>
          </template>
        </template>
      </top-bar>
    </template>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import { vueRoutes } from '@/vue-router/routes'
import { BusinessesAllPageModule } from '@/vue/pages/businesses-all-page-module'
import { BusinessesMyPageModule } from '@/vue/pages/businesses-my-page-module'

export default {
  name: 'businesses',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
    BusinessesAllPageModule,
    BusinessesMyPageModule,
  }),
}
</script>

<style scoped lang="scss"/>
