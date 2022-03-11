<template>
  <router-link
    v-if="route"
    class="app-button"
    :class="buttonClasses"
    v-bind="$attrs"
    :to="routeRecord"
  >
    <icon v-if="iconName" class="app-button__icon" :name="iconName" />
    <span v-if="text" class="app-button__content">
      {{ text }}
    </span>
  </router-link>
  <a
    v-if="href"
    class="app-button"
    :class="buttonClasses"
    v-bind="$attrs"
    :href="href"
  >
    <icon
      v-if="iconName"
      class="app-button__icon"
      :class="{
        'app-button__icon--gap': isNeedGap,
      }"
      :name="iconName"
    />
    <span v-if="text" class="app-button__content">
      {{ text }}
    </span>
  </a>
  <button
    v-else
    class="app-button"
    :class="buttonClasses"
    v-bind="$attrs"
    :disabled="isDisabled"
    :type="$attrs.type || 'button'"
  >
    <icon
      v-if="iconName"
      class="app-button__icon"
      :class="{
        'app-button__icon--gap': isNeedGap,
      }"
      :name="iconName"
    />
    <span v-if="text" class="app-button__content">
      {{ text }}
    </span>
  </button>
</template>

<script lang="ts">
import Icon from '@/common/Icon.vue'

import { computed, defineComponent, PropType } from 'vue'
import { ICON_NAMES } from '@/enums'
import { RouteRecordRaw } from 'vue-router'
import { isObject } from 'lodash-es'

const SCHEMES: Record<string, string> = {
  raised: 'raised',
  flat: 'flat',
  clear: 'clear',
}

const MODIFICATIONS: Record<string, string> = {
  default: 'default',
  danger: 'danger',
  warning: 'warning',
  success: 'success',
  info: 'info',
}

const includingValidator = (
  receipt: Record<string, string>,
): ((v: string) => boolean) => {
  return (v: string): boolean => {
    return (
      Boolean(v) &&
      !v
        .split(' ')
        .filter(el => Boolean(el) && !Object.values(receipt).includes(el))
        .length
    )
  }
}

export default defineComponent({
  name: 'app-button',
  components: { Icon },
  inheritAttrs: false,
  props: {
    iconName: { type: String as PropType<ICON_NAMES>, default: '' },
    text: { type: String, default: '' },
    schemes: {
      type: String,
      default: SCHEMES.raised,
      validator: includingValidator(SCHEMES),
    },
    modifications: {
      type: String,
      default: MODIFICATIONS.default,
      validator: includingValidator(MODIFICATIONS),
    },
    route: {
      type: Object as PropType<RouteRecordRaw>,
      default: null,
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

    const routeRecord = computed(() =>
      props.route && isObject(props.route)
        ? props.route
        : { name: props.route },
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
      routeRecord,
    }
  },
})
</script>

<style lang="scss" scoped>
.app-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  box-shadow: none;
  cursor: pointer;
  text-decoration: none;
  text-transform: none;
  border-radius: toRem(8);
  padding: toRem(8) toRem(16);
  font-size: toRem(18);
  line-height: 1.5;
  font-weight: 700;
  width: auto;
  height: auto;

  &:disabled,
  &--disabled {
    pointer-events: none;
    filter: grayscale(1);
    opacity: 0.5;
  }

  &--raised {
    background: var(--button-bg-raised);
    color: var(--button-col-raised);
    transition: 0.25s ease-in-out;

    &:hover {
      background: var(--button-raised-hover);
      transform: scale(1.05);
    }

    &:disabled {
      filter: none;
      background: var(--col-btn-disabled);
    }
  }

  &--flat {
    background: transparent;
    color: var(--button-col-flat);
    border: toRem(1) solid var(--button-border-flat);
    transition: 0.25s ease-in-out;

    &:hover {
      color: var(--button-col-flat-hover);
      border-color: var(--button-col-flat-hover);
      transform: scale(1.1);
    }
  }

  &--danger {
    background: var(--button-bg-danger);
    color: var(--button-col-danger);
  }

  &--warning {
    background: var(--button-bg-warning);
    color: var(--button-col-warning);
  }

  &--success {
    background: var(--button-bg-success);
    color: var(--button-col-success);
  }

  &--info {
    background: var(--button-bg-info);
    color: var(--button-col-info);
  }
}

.app-button__icon {
  width: 1em;
  height: 1em;

  &--gap {
    margin-right: toRem(10);
  }
}

.app-button__content {
  color: inherit;
  font: inherit;
}
</style>
