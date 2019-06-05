<template>
  <div
    class="account-type-selector__item"
    :class="{'account-type-selector__item--select' : isSelect}"
    :disabled="disabled"
    @click="$emit(EVENTS.click)"
  >
    <p class="account-type-selector__item-title">
      {{ title }}
    </p>
    <p class="account-type-selector__item-description">
      {{ label }}
    </p>
    <div
      :class="{'account-type-selector__selected-icon' : isSelect}"
      v-if="isSelect"
    >
      <i class="mdi mdi-check account-type-selector__selected-icon-tag" />
    </div>
  </div>
</template>

<script>
const EVENTS = {
  click: 'click',
}
export default {
  name: 'opportunity-card',
  props: {
    disabled: { type: Boolean, default: false },
    isSelect: { type: Boolean, default: false },
    title: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  data () {
    return {
      EVENTS,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.account-type-selector__item {
  cursor: pointer;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 25.4rem;
  height: 14.7rem;
  padding: 3.2rem;
  margin-right: 3rem;
  background-color: $col-block-bg;
  text-decoration: none;

  @include box-shadow();

  &:disabled {
    opacity: 0.7;
    cursor: default;
    box-shadow: none;
    filter: grayscale(100%);
  }
}

.account-type-selector__item--select {
  border: 0.2rem solid $col-primary-lighten;
}

.account-type-selector__item-title {
  color: $col-primary;
  font-size: 1.8rem;
}

.account-type-selector__item-description {
  margin-top: 0.8rem;
  color: $col-secondary;
  font-size: 1.2rem;
  text-align: center;
}

.account-type-selector__selected-icon {
  visibility: visible;
  width: 2.4rem;
  height: 2.4rem;
  padding: 0.2rem;
  background-color: $col-block-bg;
  border-radius: 2rem;
  top: -1.2rem;
  right: -1.2rem;
  position: absolute;
  border: 0.2rem solid $col-primary-lighten;
}

.account-type-selector__selected-icon-tag {
  font-size: 1.6rem;
  color: $col-primary-lighten;
}
</style>
