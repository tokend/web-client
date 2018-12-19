<template>
  <div class="auth">
    <div class="auth__titles">
      <h3 class="auth__title-small">
        {{ 'auth-pages.small-title' | globalize }}
      </h3>
      <h1 class="auth__title-big">{{ 'auth-pages.big-title' | globalize }}</h1>
    </div>
    <div class="auth__form">
      <logo class="auth__logo" />
      <router-view />
    </div>
  </div>
</template>

<script>
import Logo from '../assets/Logo'

export default {
  name: 'auth',
  components: {
    Logo
  }
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.auth {
  display: flex;
  min-height: 100vh;
  width: 100vw;
}

.auth__titles,
.auth__form {
  width: 50%;
}

.auth__titles {
  background: $col-auth-titles-background-fallback; /* Old browsers */
  background: linear-gradient(
      $col-auth-titles-background-light 0%,
      $col-auth-titles-background-dark 65%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 11 * $point;

  @include respond-to(large) {
    padding: 0 7 * $point;
  }

  @include respond-to(medium) {
    display: none;
  }
}

.auth__title-big {
  color: $col-text-auth-title-big;
  font-size: 5.6 * $point;
  line-height: 1.2;

  @include respond-to(large) {
    font-size: 4 * $point;
  }
}

.auth__title-small {
  color: $col-text-auth-title-small;
  font-size: 2.4 * $point;
  margin-bottom: 5.6 * $point;

  @include respond-to(large) {
    font-size: 2 * $point;
  }
}

.auth__form {
  padding: 8 * $point 11 * $point;
  position: relative;

  @include respond-to(large) {
    padding: 6 * $point 7 * $point;
  }

  @include respond-to(medium) {
    margin: 0 auto;
    max-width: 48 * $point;
    padding: 6 * $point 1.6 * $point;
    width: 100%;
  }
}

.auth__logo {
  display: inline-block;
  margin-bottom: 16.5 * $point;

  @include respond-to-height(95 * $point) {
    margin-bottom: 12 * $point;
  }

  @include respond-to-height(75 * $point) {
    margin-bottom: 6.4 * $point;
  }
}
</style>
