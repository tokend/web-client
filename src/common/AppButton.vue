<template>
  <template v-if="route">
    <router-link
      class="app-button"
      :class="buttonClasses"
      v-bind="$attrs"
      :to="route"
    >
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconName" class="app-button__icon" :name="iconName" />
    </router-link>
  </template>
  <template v-else-if="href">
    <a class="app-button" :class="buttonClasses" v-bind="$attrs" :href="href">
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconName" class="app-button__icon" :name="iconName" />
    </a>
  </template>
  <template v-else>
    <button
      class="app-button"
      :class="buttonClasses"
      v-bind="$attrs"
      :disabled="isDisabled"
      :type="$attrs.type || 'button'"
    >
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconName" class="app-button__icon" :name="iconName" />
    </button>
  </template>
</template>

<script lang="ts">
import { Icon } from '@/common'

import { computed, defineComponent, PropType } from 'vue'
import { ICON_NAMES } from '@/enums'
import { LocationAsRelativeRaw } from 'vue-router'
import { isObject } from 'lodash-es'

enum SCHEMES {
  primary = 'primary',
  flat = 'flat',
}

enum MODIFICATIONS {
  borderCircle = 'border-circle',
  borderRounded = 'border-rounded',
  iconFirst = 'icon-first',
  big = 'big',
  small = 'small',
  success = 'success',
  error = 'error',
  warning = 'warning',
  info = 'info',
}

export default defineComponent({
  name: 'app-button',
  components: { Icon },
  inheritAttrs: false,
  props: {
    iconName: { type: String as PropType<ICON_NAMES>, default: '' },
    text: { type: String, default: '' },
    schemes: {
      type: String as PropType<SCHEMES>,
      default: SCHEMES.primary,
    },
    modifications: {
      type: String as PropType<MODIFICATIONS>,
      default: MODIFICATIONS.borderRounded,
    },
    route: {
      type: Object as PropType<LocationAsRelativeRaw>,
      default: null,
      validator: (value: LocationAsRelativeRaw): boolean => {
        return !value || (isObject(value) && Boolean(value.name))
      },
    },
    href: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs }) {
    const isDisabled = computed((): boolean =>
      ['', 'disabled', true].includes(attrs.disabled as string | boolean),
    )

    const buttonClasses = computed(() => {
      const schemes = props.schemes
        .split(' ')
        .filter(el => Boolean(el))
        .map(el => `app-button--${el}`)

      const modifications = props.modifications
        .split(' ')
        .filter(el => Boolean(el))
        .map(el => `app-button--${el}`)

      let states = [...(isDisabled.value ? ['app-button--disabled'] : [])]

      return schemes.concat(modifications).concat(states).join(' ')
    })

    return {
      buttonClasses,
      isDisabled,
    }
  },
})
</script>

<style lang="scss" scoped>
.app-button {
  --button-transition-duration: 0.2s;

  outline: 0;
  font-family: var(--app-font-family);
  margin: 0;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  display: grid;
  width: min-content;
  grid: auto / auto-flow max-content;
  grid-gap: toRem(12);
  align-items: center;
  justify-content: center;
  padding: toRem(16) toRem(30);
  font-size: toRem(16);
  line-height: 1.4;
  font-weight: 600;
  letter-spacing: 0;
  transition: var(--button-transition-duration) ease-in;
  transition-property: background-color, color;
  text-decoration: none;
  border: var(--app-button-border);
  background-color: var(--app-button-bg);
  color: var(--app-button-text);

  &:disabled,
  &--disabled {
    cursor: not-allowed;
    pointer-events: none;
    filter: grayscale(0.75);
    opacity: 0.5;
  }

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    text-decoration: none;
    transition-timing-function: ease-out;
    color: var(--app-button-text-hover);
    background-color: var(--app-button-bg-hover);
    border-color: var(--app-button-border-hover);
    border: var(--app-button-border-hover);
  }

  &:not([disabled]):active {
    text-decoration: none;
    transition-timing-function: ease-out;
    background-color: var(--app-button-bg-active);
    border: var(--app-button-border-active);
  }

  &--primary {
    --app-button-primary-bg: var(--primary-main);
    --app-button-primary-bg-hover: var(--primary-dark);
    --app-button-primary-bg-active: var(--primary-dark);

    --app-button-primary-text: var(--text-primary-invert-main);
    --app-button-primary-text-hover: var(--text-primary-invert-main);

    --app-button-bg: var(--app-button-primary-bg);
    --app-button-bg-hover: var(--app-button-primary-bg-hover);
    --app-button-bg-active: var(--app-button-primary-bg-active);

    --app-button-text: var(--app-button-primary-text);
    --app-button-text-hover: var(--app-button-primary-text-hover);

    --app-button-border: 0;
    --app-button-border-hover: 0;
    --app-button-border-active: 0;
  }

  &--flat {
    --app-button-flat-text: var(--text-primary-main);
    --app-button-flat-text-hover: var(--text-primary-dark);

    --app-button-flat-border: #{toRem(2)} solid var(--text-primary-light);
    --app-button-flat-border-hover: var(--app-button-flat-border);
    --app-button-flat-border-active: var(--app-button-flat-border);

    --app-button-bg: transparent;
    --app-button-bg-hover: transparent;
    --app-button-bg-active: transparent;

    --app-button-text: var(--app-button-flat-text);
    --app-button-text-hover: var(--app-button-flat-text-hover);

    --app-button-border: var(--app-button-flat-border);
    --app-button-border-hover: var(--app-button-flat-border-hover);
    --app-button-border-active: var(--app-button-flat-border-active);
  }

  &--success {
    --app-button-flat-text: var(--success-main);
    --app-button-flat-text-hover: var(--success-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--success-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--success-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--success-dark);

    --app-button-primary-bg: var(--success-main);
    --app-button-primary-bg-hover: var(--success-dark);
    --app-button-primary-bg-active: var(--success-dark);
  }

  &--error {
    --app-button-flat-text: var(--error-main);
    --app-button-flat-text-hover: var(--error-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--error-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--error-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--error-dark);

    --app-button-primary-bg: var(--error-main);
    --app-button-primary-bg-hover: var(--error-dark);
    --app-button-primary-bg-active: var(--error-dark);
  }

  &--warning {
    --app-button-flat-text: var(--warning-main);
    --app-button-flat-text-hover: var(--warning-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--warning-dark);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--warning-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--warning-dark);

    --app-button-primary-bg: var(--warning-main);
    --app-button-primary-bg-hover: var(--warning-dark);
    --app-button-primary-bg-active: var(--warning-dark);
  }

  &--info {
    --app-button-flat-text: var(--info-main);
    --app-button-flat-text-hover: var(--info-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--info-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--info-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--info-dark);

    --app-button-primary-bg: var(--info-main);
    --app-button-primary-bg-hover: var(--info-dark);
    --app-button-primary-bg-active: var(--info-dark);
  }

  &--border-circle {
    border-radius: toRem(50);
  }

  &--border-rounded {
    border-radius: toRem(10);
  }

  &--big {
    padding: toRem(20) toRem(30);
  }

  &--small {
    padding: toRem(8) toRem(30);
  }
}

.app-button__icon {
  height: 1.2em;
  width: 1.2em;

  .app-button--icon-first & {
    grid-column: -1;
  }
}

.app-button__text {
  color: inherit;
  font: inherit;
  pointer-events: none;
  word-break: break-all;
  min-width: 0;

  @extend %text-ellipsis;
}
</style>
