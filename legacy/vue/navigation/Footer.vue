<template>
  <footer
    class="footer"
    :class="{ 'footer--private': isLoggedIn }">
    <span class="footer__item footer__text">{{ i18n.auth_copyright() }}</span>
    <span class="footer__links">
      <router-link
        class="footer__item footer__link"
        :to="vueRoutes.terms">
        {{ i18n.auth_terms() }}
      </router-link>
      <router-link
        class="footer__item footer__link"
        :to="vueRoutes.downloads">
        {{ i18n.auth_download_apps() }}
      </router-link>
    </span>
  </footer>
</template>

<script>
import { vueRoutes } from '../../vue-router/const'
import { i18n } from '../../js/i18n/index'
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../vuex/types'

export default {
  name: 'app-footer',
  data: _ => ({
    vueRoutes,
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.isLoggedIn
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '../../scss/variables';
  @import '../../scss/mixins';

  .footer {
    position: absolute;
    display: flex;
    align-items: center;
    flex-wrap: wrap-reverse;
    justify-content: center;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .footer__text,
  .footer__link {
    line-height: 2.5 * $point;
  }

  .footer__link {
    $margin: 1 * $point;
    margin: 0 $margin;
    &:not(:first-child) { margin-left: 0 }
  }

</style>
