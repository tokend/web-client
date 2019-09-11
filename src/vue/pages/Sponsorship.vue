<template>
  <div class="sponsorship-page">
    <template>
      <top-bar />
    </template>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'sponsorship',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
  }),
}
</script>
