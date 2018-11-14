<template>
  <div class="auth-page">
    <div class="auth-page__titles">
      <h3 class="auth-page__title-small">{{ i18n.auth_phrase() }}</h3>
      <h1 class="auth-page__title">
        <markdown :source="i18n.auth_title()" />
      </h1>
    </div>
    <div class="auth-page__form">
      <logotype class="auth-page__form-logotype" />
      <router-view />
      <app-footer />
    </div>
  </div>
</template>

<script>
import { i18n } from 'L@/js/i18n'
import Logotype from '../app/common/Logotype'
import AppFooter from '../navigation/Footer'
import Markdown from 'L@/vue/app/common/Markdown'

export default {
  components: {
    Logotype,
    AppFooter,
    Markdown
  },

  data () {
    return {
      i18n
    }
  }
}
</script>

<style lang="scss">
  @import 'auth';
</style>
