<template>
  <div class="app-logo">
    <img
      src="@static/branding/logo.svg"
      :alt="$config.APP_NAME"
    >
    <router-link
      class="app-logo__link"
      :to="{ name: $routes.homePage }"
    />
  </div>
</template>

<script>
export default {
  name: 'app-logo',
}
</script>

<style lang="scss" scoped>
.app-logo {
  position: relative;
}

.app-logo__link {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
