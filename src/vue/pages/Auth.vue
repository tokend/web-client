<template>
  <div class="auth">
    <div class="auth__titles">
      <!-- <h3 class="auth__title-small">
        {{ 'auth-pages.small-title' | globalize }}
      </h3> -->
    </div>
    <div class="auth__form">
      <logo class="auth__logo" />

      <div class="auth__idle-message-wrp">
        <idle-message />
      </div>

      <div class="auth__session-message-wrp">
        <session-message />
      </div>

      <router-view />
    </div>
  </div>
</template>

<script>
import Logo from '../assets/Logo'
import IdleMessage from '@/vue/common/IdleMessage'
import SessionMessage from '@/vue/common/SessionMessage'
import config from '@/config'

export default {
  name: 'auth',
  components: {
    Logo,
    IdleMessage,
    SessionMessage,
  },
  data () {
    return {
      buildVersion: config.BUILD_VERSION,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.auth {
  display: flex;
  flex: 1;
  height: 100vh;
}

.auth__titles {
  background: url('/static/images/auth_background.jpg')
    center center / cover no-repeat rgb(45, 36, 29);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 11rem;
  filter: grayscale(50%);
  width: 50%;

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
  overflow: scroll;
  width: 50%;

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
  margin-bottom: 10rem;

  @include respond-to-height(950px) {
    margin-bottom: 10rem;
  }
  @include respond-to-height(750px) {
    margin-bottom: 6.4rem;
  }
}

.auth__footer-section {
  padding: 1.6rem;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.auth__version {
  font-size: 1.2rem;
  color: $col-text-auth-version;
  margin: 1.2rem 0 0;
}
</style>
