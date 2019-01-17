<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link
          v-ripple
          :to="{ name: 'app.verification' }"
        >
          <span>{{ 'Verification' | globalize }}</span>
        </router-link>
        <router-link
          v-ripple
          :to="{ name: 'app.security' }"
        >
          <span>{{ 'Security' | globalize }}</span>
        </router-link>
      </template>
    </top-bar>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'

export default {
  name: 'settings',
  components: {
    TopBar,
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

</style>
