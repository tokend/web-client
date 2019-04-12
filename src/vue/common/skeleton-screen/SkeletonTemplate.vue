<template>
  <div class="skeleton-template">
    <div v-if="isLoading" class="skeleton-template__loader">loading...</div>
    <slot ref="slot" v-else />
  </div>
</template>

<script>
export default {
  name: 'skeleton-template',
  props: {
    isLoading: {
      type: Boolean,
      require: true,
    },
  }
}
</script>

<style scoped>
  * {
    font-weight: normal;
  }
  .skeleton-template__loader {
    content: '1';
    width: 200px;
    height: 100%;
    background-color: #ccc;
  }
  .skeleton {
    background-repeat: no-repeat;
    background-image:
     /*layer 2: avatar */
    /* white circle with 16px radius */
    radial-gradient(circle 16px, white 99%, transparent 0),
      /* layer 1: title */
      /* white rectangle with 40px height */
    linear-gradient(white 40px, transparent 0),
      /* layer 0: card bg */
      /* gray rectangle that covers whole element */
    linear-gradient(gray 100%, transparent 0);
  }
</style>
