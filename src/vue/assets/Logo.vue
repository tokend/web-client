<template>
  <router-link class="logotype" :to="vueRoutes.dashboard">
    <img src="/static/logo.svg" alt="TokenD">
  </router-link>
</template>

<script>
import { vueRoutes } from '../../vue-router'

export default {
  data: _ => ({
    vueRoutes
  })
}
</script>
