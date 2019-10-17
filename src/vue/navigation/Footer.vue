<template>
  <footer class="footer">
    <span class="footer__text">
      {{ 'footer.copyright' | globalize({ year: currentYear }) }}
    </span>
    <span class="footer__links">
      <router-link
        class="footer__link"
        :to="vueRoutes.terms"
      >{{ 'footer.terms' | globalize }}</router-link>

      <router-link
        class="footer__link"
        :to="vueRoutes.downloads"
      >{{ 'footer.download-apps' | globalize }}</router-link>

      <language-picker class="footer__language-picker" />
    </span>
  </footer>
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'
import LanguagePicker from './footer/LanguagePicker'

export default {
  name: 'app-footer',

  components: {
    LanguagePicker,
  },

  data: () => ({
    vueRoutes,
  }),

  computed: {
    currentYear () {
      return new Date().getFullYear()
    },
  },
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

.footer__language-picker {
  display: inline-block;
}

.footer__link {
  color: $col-footer-text;
}

.footer__text {
  color: $col-footer-text;
}

.footer__language-picker,
.footer__link {
  margin: 0 1rem;

  &:not(:first-child) {
    margin-left: 0;
  }
}
</style>
