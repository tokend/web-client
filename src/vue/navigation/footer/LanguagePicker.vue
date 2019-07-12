<template>
  <div class="language-picker">
    <div class="language-picker__select-wrp">
      <select
        :value="language"
        @input="setLanguage($event.target.value)"
        class="language-picker__select"
      >
        <option
          v-for="language of languages"
          :key="language"
          :value="language"
        >
          {{ language }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { i18n } from '@/i18n'

export default {
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

.language-picker__select-wrp {
  position: relative;
  z-index: 0;
}

.select-field__arrow {
  position: absolute;
  top: calc(
    #{$field-text-font-size} / 2 + #{$field-input-padding-top}
  );
  right: $field-input-padding-bottom / 2;
  width: .6rem;
  height: .6rem;
  z-index: 0;
  pointer-events: none;

  &:after {
    content: "";
    display: block;
    border: solid $field-color-text;
    width: 1.5rem;
    height: 1.5rem;
    border-width: 0 .2rem .2rem 0;
    transform: scale(.5) translate(-100%, -100%) rotate(45deg);
  }
}

.language-picker__select {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  border: 0;
  background: 0;
  padding: $field-input-padding;
  padding-right: 2rem;
  color: $field-color-text;
  cursor: pointer;
  // @include material-border($field-color-focused);
  // @include text-font-sizes;
}

.select-field__label {
  position: absolute;
  left: 0;
  top: 0;
  transition: all $field-transition-duration;
  pointer-events: none;
  color: $field-color-unfocused;
  // @include label-font-sizes;
}

.language-picker__select:focus ~ .select-field__label {
  color: $field-color-focused;
}

.language-picker__select:not(:focus).language-picker__select--empty
  ~ .select-field__label {
  top: $field-input-padding-top;
  // @include text-font-sizes;
}

.language-picker__select:disabled {
  cursor: default;
  filter: grayscale(100%);
  color: $field-color-unfocused;

  & ~ .select-field__label,
  & ~ .select-field__arrow {
    filter: grayscale(100%) opacity(0.75);
  }
}

// .select-field__err-transition-enter-active {
//   animation: select-field__err-transition-keyframes $field-transition-duration
//     ease-in-out;
// }

// .select-field__err-transition-leave-active {
//   animation: select-field__err-transition-keyframes $field-transition-duration
//     ease-in-out reverse;
// }

// @keyframes select-field__err-transition-keyframes {
//   from {
//     max-height: 0;
//     margin-top: 0;
//     overflow: hidden;
//   }
//   to {
//     max-height: $field-error-font-size * $field-error-line-height;
//     margin-top: $field-error-margin-top;
//     overflow: hidden;
//   }
// }
</style>
