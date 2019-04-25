<template>
  <div class="skeleton-loader">
    <div
      class="skeleton-loader__stub"
      :class="`skeleton-loader__stub--${TEMPLATES[template]}`"
    />
  </div>
</template>

<script>
const TEMPLATES = {
  bigIcon: 'big-icon',
  bigString: 'big-string',
}

export default {
  name: 'skeleton-loader',
  props: {
    template: {
      type: String,
      required: true,
      validator (value) {
        return Object.keys(TEMPLATES).includes(value)
      },
    },
  },
  data: _ => ({
    TEMPLATES,
  }),
}
</script>

<style scoped lang="scss">
  @import "~@scss/variables";

  .skeleton-loader {
    z-index: 1;
  }

  .skeleton-loader__stub {
    position: relative;
    background-color: $col-background-skeleton-loader;
    border-radius: 5rem;

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
      animation: skeleton-loader__gradient-animation 0.8s linear infinite;
    }

    &--big-string {
      height: 2.2rem;
      width: 15rem;
    }

    &--big-icon {
      height: 5.5rem;
      width: 5.5rem;
    }
  }

  @keyframes skeleton-loader__gradient-animation {
    from {
      left: -50%;
    }
    to {
      left: 100%;
    }
  }
</style>
