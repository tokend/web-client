<template>
  <img
    v-if="logoKey"
    class="token-logo token-logo__image"
    :src="tokenLogoUrl"
  >
  <p
    v-else
    class="token-logo token-logo__code-abbr"
  >
    {{ tokenCode | abbreviate }}
  </p>
</template>

<script>
import config from '@/config'

export default {
  name: 'token-logo',
  props: {
    logoKey: { type: String, default: '' },
    tokenCode: { type: String, required: true },
  },
  computed: {
    tokenLogoUrl () {
      return `${config.FILE_STORAGE}/${this.logoKey}`
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.token-logo {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;
}

.token-logo__image {
  display: block;
}

.token-logo__code-abbr {
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-token-logo-background;
  color: $col-token-logo-text;
}
</style>
