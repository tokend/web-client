<template>
  <div class="token-list">
    <md-list class="md-triple-line">
      <md-list-item
        v-for="(token, key) in tokens"
        class="token-list__list-item"
        :class="{ 'token-list__list-item--selected': value === token.code }"
        :key="key"
        @click="select(token)"
      >
        <md-avatar class="md-primary">
          <img
            :src="token.logoURL"
            v-if="token.logoURL">
          <span
            class="token-list__char"
            v-else>
            {{ token.code.charAt(0) }}
          </span>
        </md-avatar>

        <div class="md-list-item-text">
          <span>{{ token.code }}</span>
          <span>{{ token.attachedDetails.balance }} {{ token.code }}</span>
          <span>{{ token.attachedDetails.convertedBalance }}</span>
        </div>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
import { commonEvents } from '../../../../js/events/common_events'

export default {
  name: 'token-list',
  props: {
    tokens: { type: Array, required: true },
    value: { type: String, required: true }
  },
  methods: {
    select (token) {
      this.$emit(commonEvents.inputEvent, token.code)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';
  .token-list__char {
    color: $col-primary-txt;
  }

  .token-list__list-item {
    &--selected {
      background: $col-accent;

      .md-list-item-text {
        color: $col-primary-txt;
      }
    }
  }
</style>
