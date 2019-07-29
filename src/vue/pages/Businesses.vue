<template>
  <div class="businesses-page">
    <template>
      <top-bar />
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
