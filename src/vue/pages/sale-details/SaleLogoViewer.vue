<template>
  <div class="sale-logo-viewer">
    <img
      class="sale-logo-viewer__img"
      :src="url"
    >
  </div>
</template>

<script>
export default {
  name: 'sale-logo-viewer',

  props: {
    url: { type: String, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.sale-logo-viewer {
  background-color: $col-sale-details-logo-bg;
  position: relative;
  width: 100%;
}

.sale-logo-viewer__img {
  position: absolute;
  max-height: 100%;
  max-width: 100%;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  object-fit: cover;
  border-radius: 0.4rem;
}
</style>
