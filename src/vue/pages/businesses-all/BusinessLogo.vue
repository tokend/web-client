<template>
  <img
    v-if="logoUrl"
    class="business-logo business-logo__image"
    :src="logoUrl"
  >
  <p
    v-else
    class="business-logo business-logo__code-abbr"
  >
    {{ name | abbreviate }}
  </p>
</template>

<script>
export default {
  name: 'business-logo',
  props: {
    logoUrl: { type: String, required: true },
    name: { type: String, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.business-logo {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;
}

.business-logo__image {
  display: block;
}

.business-logo__code-abbr {
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-asset-logo-dark-background;
  color: $col-asset-logo-dark-text;
  line-height: 1;
}
</style>
