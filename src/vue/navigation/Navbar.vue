<template>
  <nav class="navbar">
    <div class="navbar__title-wrapper">
      <template v-if="$route.meta.pageSubnameTranslationId">
        <h3 class="navbar__sub-title">
          {{ $route.meta.pageSubnameTranslationId | globalize }}
        </h3>
      </template>
      <h2 class="navbar__title">
        {{ $route.meta.pageNameTranslationId | globalize }}
      </h2>
    </div>

    <div class="navbar__passport-wrp">
      <passport />
    </div>
  </nav>
</template>

<script>
import Passport from './Passport'

export default {
  name: 'navbar',
  components: { Passport },
}
</script>

<style scoped lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

.navbar {
  width: 100%;
  background-color: $col-app-content-background;
  padding: 3.3rem $content-padding-right 2.1rem $content-padding-left;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include respond-to-custom($sidebar-hide-bp) {
    padding: 3.3rem $content-side-paddings-sm
      2.1rem $content-side-paddings-sm + 5.2rem;
  }

  .navbar__title {
    font-size: 4rem;
    font-weight: normal;

    @include respond-to-custom($sidebar-hide-bp) {
      font-size: 3rem;
    }
  }
}
</style>
