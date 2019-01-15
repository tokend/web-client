<template>
  <footer class="footer">
    <span class="footer__item footer__text">
      {{ 'footer.copyright' | globalize }}
    </span>
    <span class="footer__links">
      <router-link
        class="footer__item footer__link"
        :to="vueRoutes.terms">
        {{ 'footer.terms' | globalize }}
      </router-link>
      <router-link
        class="footer__item footer__link"
        :to="vueRoutes.downloads">
        {{ 'footer.download-apps' | globalize }}
      </router-link>
    </span>
  </footer>
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'

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
    display: flex;
    align-items: center;
    flex-wrap: wrap-reverse;
    justify-content: center;
    width: 100%;
  }

  .footer__text,
  .footer__link {
    line-height: 2.5rem;
  }

  .footer__link {
    margin: 0 1rem;
    color: $col-link;
    &:not(:first-child) { margin-left: 0 }
  }

</style>
