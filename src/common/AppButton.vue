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
import { RouteRecordRaw } from 'vue-router'
import { isObject } from 'lodash-es'

/* TODO: Add more schemes */
enum SCHEMES {
  primary = 'primary',
  flat = 'flat',
  success = 'success',
  error = 'error',
}

/* TODO: Add more modifications */
enum MODIFICATIONS {
  borderCircle = 'border-circle',
  borderRounded = 'border-rounded',
  iconFirst = 'icon-first',
  big = 'big',
  small = 'small',
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
      type: Object as PropType<RouteRecordRaw>,
      default: null,
      validator: (value: RouteRecordRaw): boolean => {
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

    const isNeedGap = computed(() => props.iconName && props.text)

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
      isNeedGap,
    }
  },
})
</script>

<style lang="scss" scoped>
/* TODO: Add colors to Button variables, add more modifications ans schemes */
.app-button {
  outline: 0;
  font-family: var(--app-font-family);
  margin: 0;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  display: grid;
  width: min-content;
  grid: auto / auto-flow max-content;
  grid-gap: toRem(16);
  align-items: center;
  justify-content: center;
  min-width: toRem(100);
  padding: toRem(16) toRem(25);
  font-size: toRem(16);
  line-height: 1.2;
  font-weight: 500;
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
  }

  &:not([disabled]):active {
    text-decoration: none;
    transition-timing-function: ease-out;
    background-color: var(--app-button-bg-active);
  }

  &--primary {
    --app-button-bg: var(--col-primary-main);
    --app-button-bg-hover: var(--col-primary-dark);
    --app-button-bg-active: var(--col-primary-dark);
    --app-button-text: var(--col-text-primary-dark);
    --app-button-text-hover: var(--col-text-primary-dark);
    --app-button-border: none;
  }

  &--primary-bright {
    --app-button-bg: var(--col-primary-light);
    --app-button-bg-hover: var(--col-primary-main);
    --app-button-bg-active: var(--col-primary-main);
    --app-button-text: var(--col-text-primary-dark);
    --app-button-text-hover: var(--col-text-primary-dark);
    --app-button-border: none;
  }

  &--primary-flat {
    --app-button-text: var(--col-text-primary-light);
    --app-button-text-hover: var(--col-text-primary-light);
    --app-button-border: #{toRem(2)} solid var(--col-text-primary-light);
    --app-button-bg: var(--app-bg);
  }

  &--success {
    --app-button-bg: var(--col-success-main);
    --app-button-bg-hover: var(--col-success-dark);
    --app-button-bg-active: var(--col-success-dark);
    --app-button-text: var(--col-text-primary-dark);
    --app-button-text-hover: var(--col-text-primary-dark);
    --app-button-border: none;
  }

  &--error {
    --app-button-bg: var(--error-main);
    --app-button-bg-hover: var(--error-light);
    --app-button-bg-active: var(--error-light);
    --app-button-text: var(--error-dark);
    --app-button-text-hover: var(--error-dark);
    --app-button-border: none;
  }

  &--border-circle {
    border-radius: toRem(52);
  }

  &--border-rounded {
    border-radius: toRem(10);
  }

  &--big {
    padding: toRem(17) toRem(20);
    min-height: toRem(60);
    width: 100%;
  }

  &--small {
    font-size: toRem(12);
    padding: toRem(8) toRem(10);
    min-width: toRem(80);
    grid-gap: toRem(6);
  }
}

.app-button__icon {
  height: toRem(12);
  width: toRem(12);

  .app-button--icon-first & {
    grid-column: -1;
  }
}

.app-button__text {
  color: inherit;
  font: inherit;
  pointer-events: none;
  min-width: 0;

  // Magic fix of the font vertical alignment
  margin-top: calc(#{toRem(2)} * (-1));
  word-break: break-all;

  @include text-ellipsis;
}
</style>
