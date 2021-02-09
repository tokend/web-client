<template>
  <div class="card-logo">
    <img
      v-if="imgUrl"
      :src="imgUrl"
      class="card-logo__viewer card-logo__viewer--image"
      :class="{ 'card-logo__viewer--full-cover' : isFullCover }"
    >
    <p
      v-else
      class="card-logo__viewer card-logo__viewer--abbr"
      :class="{ 'card-logo__viewer--dark' : darkMode }"
    >
      {{ text }}
    </p>
  </div>
</template>

<script>
import { abbreviate } from '@/vue/filters/abbreviate'

export default {
  name: 'card-logo',
  props: {
    imgUrl: { type: String, default: '' },
    logoText: { type: String, default: '' },
    darkMode: { type: Boolean, default: false },
    isFullCover: { type: Boolean, default: false },
  },
  computed: {
    text () {
      return abbreviate(this.logoText).slice(0, 3)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  .card-logo {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 11rem;
    background-color: $col-asset-card-header-background;
  }

  .card-logo__viewer {
    width: 9rem;
    height: 9rem;
    border-radius: 50%;

    &--image {
      display: block;
    }

    &--abbr {
      font-size: 2.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $col-asset-logo-background;
      color: $col-asset-logo-text;
    }

    &--dark {
      background: $col-asset-logo-dark-background;
      color: $col-asset-logo-dark-text;
    }

    &--full-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
  }
</style>
