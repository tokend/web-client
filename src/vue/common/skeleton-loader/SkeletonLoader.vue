<template>
  <div
    class="skeleton-loader"
    :class="`skeleton-loader--${TEMPLATES[template]}`"
  >
    <div
      class="skeleton-loader__stub"
      :class="`skeleton-loader__stub--${TEMPLATES[template]}`"
    />
  </div>
</template>

<script>
const TEMPLATES = {
  bigIcon: 'big-icon',
  smallIcon: 'small-icon',
  bigString: 'big-string',
  cardViewer: 'card-viewer',
  saleViewer: 'sale-viewer',
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
@import '~@scss/variables.scss';
@import '~@scss/mixins.scss';

// TODO: refactoring variables name
$asset-card-header-height: 8.5rem;
$asset-card-margin: 0.75rem;
$media-desktop: 1130px;
$media-small-desktop: 960px;

/* stylelint-disable function-calc-no-invalid */
@mixin asset-card-width ($width) {
  flex: 0 1 calc(#{$width}% - (#{$asset-card-margin} * 2));
  max-width: calc(#{$width}% - (#{$asset-card-margin} * 2));
}
/* stylelint-enable function-calc-no-invalid */

.skeleton-loader {
  z-index: $z-skeleton-loader;

  &--card-viewer {
    margin: $asset-card-margin;

    @include asset-card-width(25);
    @include respond-to-custom($media-desktop) {
      @include asset-card-width(33);
    }
    @include respond-to-custom($media-small-desktop) {
      @include asset-card-width(50);
    }
    @include respond-to-custom($sidebar-hide-bp) {
      @include asset-card-width(33);
    }
    @include respond-to(small) {
      @include asset-card-width(50);
    }
    @include respond-to(xsmall) {
      @include asset-card-width(100);
    }
  }

  &--sale-viewer {
    margin: 1rem;
  }
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
    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.25),
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

  &--small-icon {
    height: 3.7rem;
    width: 3.7rem;
    border-radius: 0.4rem;
  }

  &--card-viewer {
    min-height: 19rem;
  }

  &--sale-viewer {
    border-radius: 0.4rem;
    height: 40rem;
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
