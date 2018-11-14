<template>
  <router-view />
</template>

<script>
export default {
  name: 'app-content',

  computed: {
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
