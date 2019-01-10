<template>
  <div class="auth">
    <div class="auth__titles">
      <h3 class="auth__title-small">
        {{ 'auth-pages.small-title' | globalize }}
      </h3>
      <h1 class="auth__title-big">
        {{ 'auth-pages.big-title' | globalize }}
      </h1>
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
  padding: 0 11rem;

  @include respond-to(large) {
    padding: 0 7rem;
  }

  @include respond-to(medium) {
    display: none;
  }
}

.auth__title-big {
  color: $col-text-auth-title-big;
  font-size: 5.6rem;
  line-height: 1.2;

  @include respond-to(large) {
    font-size: 4rem;
  }
}

.auth__title-small {
  color: $col-text-auth-title-small;
  font-size: 2.4rem;
  margin-bottom: 5.6rem;

  @include respond-to(large) {
    font-size: 2rem;
  }
}

.auth__form {
  padding: 8rem 11rem;
  position: relative;

  @include respond-to(large) {
    padding: 6rem 7rem;
  }

  @include respond-to(medium) {
    margin: 0 auto;
    max-width: 48rem;
    padding: 6rem 1.6rem;
    width: 100%;
  }
}

.auth__logo {
  display: inline-block;
  margin-bottom: 16.5rem;

  @include respond-to-height(950px) {
    margin-bottom: 12rem;
  }

  @include respond-to-height(750px) {
    margin-bottom: 6.4rem;
  }
}
</style>
