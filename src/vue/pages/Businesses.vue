<template>
  <div class="businesses-page">
    <template>
      <top-bar>
        <template slot="main">
          <router-link
            v-if="getModule().canRenderSubmodule(BusinessesAllPageModule)"
            :to="vueRoutes.allBusinesses"
          >
            <span>{{ 'businesses.all-tab' | globalize }}</span>
          </router-link>
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

export default {
  name: 'businesses',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
    BusinessesAllPageModule,
  }),
}
</script>

<style scoped lang="scss"/>
