<template>
  <img
    v-if="business.logoLink"
    class="current-business-logo current-business-logo__image"
    :src="business.logoLink"
  >
  <p
    v-else
    class="current-business-logo current-business-logo__code-abbr"
  >
    {{ business.name | abbreviate }}
  </p>
</template>

<script>
import { BusinessRecord } from '@/vue/pages/businesses-all/business.record'

export default {
  name: 'current-business-logo',
  props: {
    business: {
      type: BusinessRecord,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.current-business-logo {
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 50%;
}

.current-business-logo__image {
  display: block;
}

.current-business-logo__code-abbr {
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-asset-logo-dark-background;
  color: $col-asset-logo-dark-text;
  line-height: 1;
}
</style>
