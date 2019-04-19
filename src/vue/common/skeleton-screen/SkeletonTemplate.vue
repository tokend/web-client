<template>
  <div class="skeleton-template">
    <div
      v-if="isLoading"
      class="skeleton-template__loader"
      :class="slotRootClass">
      <div />
    </div>
    <slot
      class="slot"
      ref="slot"
      v-else />
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
  },
  data: () => ({
    vueComponent: 'vue-component',
  }),
  computed: {
    slotRootClass () {
      let classFromDefaultSlot = this.$slots.default[0].data.staticClass
      let tagRootDefaultSlot = this.$slots.default[0].tag
      return (tagRootDefaultSlot.indexOf(this.vueComponent) > -1) ? 'base-template' : classFromDefaultSlot
    },
  },
}
</script>

<style scoped lang="scss">
  * {
    font-weight: normal;
  }
  .skeleton-template {
    z-index: 1;
  }
  .base-template {
    height: 22px;
    width: 150px;
  }
  .skeleton-template__loader {
    position: relative;
    background-color: #DDDCDE;
    border-radius: .2rem;
    &:after {
      content: '';
      width: 45%;
      height: 100%;
      position: absolute;
      background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, .25),
          transparent
      );
      left: 0;
      top: 0;
      animation: skeleton-loading 1.5s infinite;
      animation-timing-function: linear;
    }
  }
  @keyframes skeleton-loading {
    from {
      left: -50%;
    }
    to {
      left: 100%;
    }
  }
</style>
