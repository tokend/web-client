<template>
  <footer class="footer">
    <span class="footer__item footer__text">
      {{ 'auth-pages.copyright' | globalize }}
    </span>
    <span class="footer__links">
      <router-link
        class="footer__item footer__link"
        :to="vueRoutes.terms">
        {{ 'auth-pages.terms' | globalize }}
      </router-link>
      <router-link
        class="footer__item footer__link"
        :to="vueRoutes.downloads">
        {{ 'auth-pages.download-apps' | globalize }}
      </router-link>
    </span>
  </footer>
</template>

<script>
import { vueRoutes } from '@/vue-router'

export default {
  name: 'app-footer',
  data: () => ({
    vueRoutes
  })
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';

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
    margin: 0 1 * $point;
    color: $col-link;
    &:not(:first-child) { margin-left: 0 }
  }

</style>
