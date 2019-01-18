<template>
  <router-link class="logotype" :to="vueRoutes.app">
    <img src="/static/logo.svg" alt="TokenD">
  </router-link>
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'

export default {
  data: _ => ({
    vueRoutes,
  }),
}
</script>
