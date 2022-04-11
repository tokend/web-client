<template>
  <template v-if="route">
    <router-link
      class="app-button"
      :class="buttonClasses"
      v-bind="$attrs"
      :to="route"
    >
      <icon v-if="iconName" class="app-button__icon" :name="iconName" />
      <span v-if="text" class="app-button__content">
        {{ text }}
      </span>
    </router-link>
  </template>
  <template v-else-if="href">
    <a class="app-button" :class="buttonClasses" v-bind="$attrs" :href="href">
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
  </template>
  <template v-else>
    <button
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
</template>

<script lang="ts">
import Icon from '@/common/Icon.vue'

import { computed, defineComponent, PropType } from 'vue'
import { ICON_NAMES } from '@/enums'
import { RouteRecordRaw } from 'vue-router'
import { isObject } from 'lodash-es'

enum SCHEMES {
  raised = 'raised',
  flat = 'flat',
  clear = 'clear',
}

enum MODIFICATIONS {
  default = 'default',
  danger = 'danger',
  warning = 'warning',
  success = 'success',
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
      default: SCHEMES.raised,
    },
    modifications: {
      type: String as PropType<MODIFICATIONS>,
      default: MODIFICATIONS.default,
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
