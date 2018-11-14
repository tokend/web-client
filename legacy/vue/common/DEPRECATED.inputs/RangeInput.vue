<template>
  <div
    class="range-input"
    :class="{ disabled }">
    <input
      type="range"
      class="range-input__initial-marker"

      v-if="initialValue && Number(initialValue) > 0"
      :value="initialValue"
      :min="min"
      :max="max"
      :step="step"
      disabled
    >

    <input
      type="range"
      class="slider"
      :min="min"
      :max="max"
      :step="step"
      :value="value"
      ref="inputField"
      :disabled="disabled"
    >
  </div>
</template>

<script>
import { commonEvents } from 'L@/js/events/common_events'
import config from '@/config'

export default {
  name: 'range-input',
  props: {
    min: {
      type: [ String, Number ],
      default: 0
    },
    max: {
      type: [ String, Number ],
      required: true,
      default: '' || 0
    },
    step: {
      type: [ String, Number ],
      default: config.MINIMAL_NUMBER_INPUT_STEP
    },
    value: {
      type: [ String, Number ],
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    initialValue: {
      type: [ String, Number ],
      required: false,
      default: '' || 0
    }
  },

  mounted () {
    const listener = this.onInput.bind(this)
    const input = this.$refs.inputField
    input.addEventListener('mousedown', function (event) {
      listener(event)
      input.addEventListener('mousemove', listener)
    })

    input.addEventListener('mouseup', function (event) {
      input.removeEventListener('mousemove', listener)
    })
  },

  methods: {
    onInput (event) {
      this.$emit(commonEvents.inputEvent, event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';
  @import '../../../scss/mixins';

  .range-input {
    position: relative;
    overflow: hidden;
    width: 100%;

    &.disabled {
      opacity: .45;
    }
  }

  $slider-width-number: 1000;
  $slider-width: #{$slider-width-number}px;
  $slider-height: 2px;
  $background-slider: #c7c7c7;
  $background-filled-slider: $col-text-accented;
  $thumb-width: 18px;
  $thumb-height: 18px;
  $thumb-radius: 8px;
  $thumb-background: $col-text-accented;
  $thumb-border: 1px solid $col-text-accented;
  $shadow-size: -8px;
  $fit-thumb-in-slider: -8px;

  $marker-width: 8px;
  $marker-height: $marker-width;
  $marker-background: #c7c7c7;

  @function makelongshadow($color, $size) {
    $val: 5px 0 0 $size $color;

    @for $i from 6 through $slider-width-number {
      $val: #{$val}, #{$i}px 0 0 $size #{$color};
    }

    @return $val;
  }

  div {
    height: 100px;
    display: flex;
    justify-content: center;
  }

  input.slider {
    @include center-vertically;

    align-items: center;
    background: none;
    cursor: pointer;
    display: flex;
    left: 0;
    height: 100%;
    min-height: 50px;
    overflow: hidden;
    position: absolute;
    width: 100%;
    -webkit-appearance: none;
    -moz-appearance: none;

    &:focus {
      box-shadow: none;
      outline: none;
    }

    &::-webkit-slider-runnable-track {
      background: $background-filled-slider;
      content: '';
      height: $slider-height;
      pointer-events: none;
    }

    &::-webkit-slider-thumb {
      appearance: none;
      background: $thumb-background;
      border: $thumb-border;
      border-radius: $thumb-radius;
      box-shadow: makelongshadow($background-slider, $shadow-size);
      height: $thumb-height;
      margin-top: $fit-thumb-in-slider;
      width: $thumb-width;
    }

    &::-moz-range-track {
      width: $slider-width;
      height: $slider-height;
    }

    &::-moz-range-thumb {
      height: $thumb-height;
      width: $thumb-width;
      background: $thumb-background;
      border-radius: $thumb-radius;
      border: $thumb-border;
      position: relative;
    }

    &::-moz-range-progress {
      height: $slider-height;
      background: $background-filled-slider;
      border: 0;
      margin-top: 0;
    }

    &::-ms-track {
      width: 100%;
      height: 8.4px;
      cursor: pointer;
      animate: 0.2s;
      background: transparent;
      border-color: transparent;
      border-width: 16px 0;
      color: transparent;
    }
    &::-ms-fill-lower {
      background: $col-text-accented;
    }
    &::-ms-fill-upper {
      background: $col-text-accented;
    }
    &::-ms-thumb {
      height: 36px;
      width: 16px;
      border-radius: 3px;
      background: $col-text-accented;
      cursor: pointer;
    }
    &:focus::-ms-fill-lower {
      background: $col-text-accented;
    }
    &:focus::-ms-fill-upper {
      background: $col-text-accented;
    }

    &:disabled {
      opacity: .75;
      &::-webkit-slider-runnable-track,
      &::-webkit-slider-thumb,
      &::-moz-range-track,
      &::-moz-range-thumb,
      &::-moz-range-progress {
        background-color: $col-unfocused;
      }
    }
  }

  .range-input__initial-marker {
    @include center-vertically;

    background: none;
    position: absolute;
    left: 0;
    width: 100%;
    -webkit-appearance: none;
    -moz-appearance: none;
    pointer-events: none;

    &::-webkit-slider-thumb {
      appearance: none;
      background: $marker-background;
      border-radius: $thumb-radius;
      height: $marker-height;
      position: relative;
      top: $marker-height / 2;
      margin-top: $fit-thumb-in-slider;
      width: $marker-width;
    }

  }

</style>
