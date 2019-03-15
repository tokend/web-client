<template>
  <img
    v-if="logoUrl"
    class="asset-logo-viewer asset-logo-viewer__image"
    :src="logoUrl"
  >
  <p
    v-else
    class="asset-logo-viewer asset-logo-viewer__code-abbr"
  >
    {{ assetCode | abbreviate }}
  </p>
</template>

<script>
export default {
  name: 'asset-logo-viewer',
  props: {
    logoUrl: { type: String, required: true },
    assetCode: { type: String, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.asset-logo-viewer {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;
}

.asset-logo-viewer__image {
  display: block;
}

.asset-logo-viewer__code-abbr {
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-asset-logo-background;
  color: $col-asset-logo-text;
  line-height: 1;
}
</style>
