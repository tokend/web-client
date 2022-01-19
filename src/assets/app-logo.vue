<template>
  <div class="app-logo">
    {{ $t('LOGO') }}
    <router-link
      class="app-logo__link"
      :to="{ name: $routes.marketplacePage }"
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
