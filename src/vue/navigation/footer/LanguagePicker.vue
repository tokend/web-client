<template>
  <div class="language-picker">
    <div class="language-picker__select-wrp">
      <select
        :value="language"
        @input="setLanguage($event.target.value)"
        class="language-picker__select"
      >
        <option
          v-for="lng of languages"
          :key="lng"
          :value="lng"
        >
          {{ lng | humanizeLangCode }}
        </option>
      </select>

      <div class="language-picker__select-arrow" />
    </div>
  </div>
</template>

<script>
import { i18n } from '@/i18n'

export default {

  filters: {
    humanizeLangCode (code) {
      return {
        [undefined]: 'Unknown',
        'ru': 'Русский',
        'uk': 'Українська',
        'en': 'English',
      }[code]
    },
  },
  data () {
    return {
      // TODO: make i18n.language and i18n.languages responsive
      language: i18n.language,
      languages: i18n.languages,
    }
  },

  created () {
    i18n.onLanguageChanged(lng => (this.language = lng))
  },

  methods: {
    setLanguage (lng) {
      i18n.changeLanguage(lng)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/variables';
@import '@/scss/mixins';
@import '~@/vue/fields/scss/variables';

/* stylelint-disable */

$font-size: 1.4rem;

.language-picker__select-wrp {
  position: relative;
  z-index: 0;
}

.language-picker__select-arrow {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-75%) scale(0.5) rotate(45deg);
  width: 1.4rem;
  height: 1.4rem;
  z-index: 0;
  pointer-events: none;
  border: solid $col-footer-text;
  border-width: 0 0.2rem 0.2rem 0;
}

.language-picker__select {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  border: 0;
  background: 0;
  padding: 0 1.6rem 0 0;
  color: $col-footer-text;
  font-size: 1.4rem;
  cursor: pointer;
}
</style>
