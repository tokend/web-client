<template>
  <div
    class="tick-field"
    :class="{
      'tick-field--checked': checked,
      'tick-field--error': errorMessage,
      'tick-field--disabled': isDisabled,
      'tick-field--readonly': isReadonly,
    }"
  >
    <div class="tick-field__input-wrapper">
      <input
        class="tick-field__input"
        type="checkbox"
        :id="`tick-field__${uid}`"
        v-bind="$attrs"
        v-on="listeners"
        :checked="checked"
        :value="cbValue"
        :name="$attrs.name || `tick-field__${uid}`"
        :tabindex="isDisabled || isReadonly ? -1 : tabIndex"
      >
      <div class="tick-field__tick">
        <icon
          class="tick-field__tick-icon"
          :name="$icons.check"
        />
      </div>
    </div>
    <label
      class="tick-field__label"
      :for="`tick-field__${uid}`"
    >
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance } from 'vue'
import Icon from '@/common/Icon.vue'

enum EVENTS {
  updateModelValue = 'update:modelValue',
}

export default defineComponent({
  name: 'tick-field',
  components: { Icon },
  props: {
    modelValue: {
      type: [Array, String, Number, Boolean, Object],
      default: '',
    },
    cbValue: {
      type: [Array, String, Number, Boolean, Object],
      default: false,
    },
    label: { type: String, default: '' },
    errorMessage: {  type: String, default: ''  },
    tabIndex: { type: Number, default: 0 },
  },
  emits: Object.values(EVENTS),
  setup (props, { emit, attrs }) {
    const uid = getCurrentInstance()?.uid

    const checked = computed(() => {
      const model = props.modelValue
      const value = props.cbValue

      if (!value) return model

      let resultModel: unknown[] = model as unknown[]
      let result
      switch (_typeof(model)) {
      case 'number': {
        result = +model & +value
        break
      }
      case 'array': {
        result = _typeof(value) !== 'array'
          ? ~resultModel.findIndex(el => el === value)
          : resultModel.every(el => _arrayIncludes(resultModel, el))
        break
      }
      default: {
        result = model
      }
      }
      return result
    })

    const listeners = computed(() => ({
      change: (event: Event) => {
        const isChecked = (event.target as HTMLInputElement).checked
        const model = props.modelValue
        const value = props.cbValue

        if (!value) {
          return emit(EVENTS.updateModelValue, isChecked)
        }

        switch (_typeof(model)) {
        case 'number': {
          emit(
            EVENTS.updateModelValue,
            isChecked
              ? +model + +value
              : +model - +value,
          )
          break
        }
        case 'array': {
          let resultModel: unknown[] = model as unknown[]
          if (_typeof(value) !== 'array') {
            emit(EVENTS.updateModelValue, isChecked
              ? resultModel.concat(value)
              : resultModel.filter((item) => item !== value))
          } else {
            emit(
              EVENTS.updateModelValue, isChecked
                ? resultModel.concat(value)
                : resultModel.filter((item) =>
                  !_arrayIncludes(value as unknown[], item)),
            )
          }
          break
        }
        default: {
          return emit(EVENTS.updateModelValue, isChecked)
        }
        }
      },
    }))

    const isDisabled = computed(() =>
      ['', 'disabled', true].includes(attrs.disabled as string | boolean),
    )

    const isReadonly = computed(() =>
      ['', 'readonly', true].includes(attrs.readonly as string | boolean),
    )

    const _typeof = (value: unknown) => {
      const type = typeof value

      let result

      switch (type) {
      case 'object': {
        if (Array.isArray(value)) {
          result = 'array'
        } else if (value === null) {
          result = null
        }
        break
      }
      default: {
        result = type
      }
      }

      return result
    }

    const _arrayIncludes = (array: unknown[], value: unknown) => {
      return Boolean(array.find(el => el === value))
    }

    return {
      checked,
      listeners,
      uid,
      isDisabled,
      isReadonly,
    }
  },
})
</script>

<style lang="scss" scoped>
.tick-field {
  display: flex;
  align-items: center;

  &--read-only,
  &--disabled {
    cursor: default;
    filter: grayscale(100%);
  }
}

.tick-field__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: toRem(12);
}

.tick-field__input {
  opacity: 0;
}

.tick-field__label {
  font-weight: 600;
  font-size: toRem(14);
  line-height: 1.3;

  @include field-label;
}

.tick-field__tick {
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: toRem(18.5);
  height: toRem(18.5);
  border: toRem(1) solid var(--field-col-border);
  border-radius: 0.2rem;
  transition: var(--field-transition-duration) ease-in-out;

  .tick-field--checked & {
    background: var(--tick-field-tick-bg);
    border-color: transparent;
  }
}

.tick-field__tick-icon {
  width: 100%;
  height: 100%;
  opacity: 0;
  color: var(--tick-field-tick-icon);
  transition: var(--field-transition-duration) ease-in-out;

  .tick-field--checked & {
    opacity: 1;
  }
}

</style>
