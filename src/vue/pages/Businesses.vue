<template>
  <div class="businesses-page">
    <template>
      <top-bar>
        <template slot="main">
          <!-- eslint-disable-next-line max-len -->
          <router-link :to="vueRoutes.myBusinesses">
            <span>{{ 'businesses.my-tab' | globalize }}</span>
          </router-link>
          <!-- eslint-disable-next-line max-len -->
          <router-link :to="vueRoutes.allBusinesses">
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

export default {
  name: 'businesses',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
  }),
}
</script>

<style scoped lang="scss"/>
