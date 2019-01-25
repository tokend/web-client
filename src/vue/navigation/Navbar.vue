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
  min-height: 12rem;
  background-color: $col-app-content-background;
  padding: 0 $content-side-paddings;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include respond-to-custom($sidebar-hide-bp) {
    padding: 0 $content-side-paddings-sm 0 $content-side-paddings-sm + 5.2rem;
  }
}

.navbar__title {
  color: $col-text-page-heading;
  font-size: 4rem;
  line-height: 1.5;
  font-weight: 400;

  @include respond-to-custom($sidebar-hide-bp) {
    font-size: 3.2rem;
  }
}

.navbar__sub-title {
  margin-bottom: 0.8rem;
  font-size: 1.4rem;
  font-weight: 400;
}
</style>
