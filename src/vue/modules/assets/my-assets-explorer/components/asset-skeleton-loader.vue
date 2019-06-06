<template>
  <div class="balance-card-viewer">
    <div class="balance-card-viewer__header">
      <skeleton-loader
        template="bigIcon"
      />
    </div>
    <div class="balance-card-viewer__info">
      <skeleton-loader
        class="balance-card-viewer__code"
        template="bigString"
      />
      <skeleton-loader
        class="balance-card-viewer__name"
        template="smallString"
      />
      <skeleton-loader
        class="balance-card-viewer__balance"
        template="smallString"
      />
    </div>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

export default {
  name: 'asset-skeleton-loader',
  components: { SkeletonLoader },
}
</script>

<style scoped lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

$asset-card-header-height: 8.5rem;
$asset-card-margin: 0.75rem;

$media-desktop: 1130px;
$media-small-desktop: 960px;

// wait for 10.0.2 stylelint version
/* stylelint-disable function-calc-no-invalid */
@mixin asset-card-width ($width) {
  flex: 0 1 calc(#{$width} - (#{$asset-card-margin} * 2));
  max-width: calc(#{$width} - (#{$asset-card-margin} * 2));
}
/* stylelint-enable function-calc-no-invalid */

.balance-card-viewer {
  min-height: 19rem;
  cursor: pointer;
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-field-shadow;
  background-color: $col-asset-card-background;
  margin: $asset-card-margin;

  @include asset-card-width(25%);
  @include respond-to-custom($media-desktop) {
    @include asset-card-width(33%);
  }
  @include respond-to-custom($media-small-desktop) {
    @include asset-card-width(50%);
  }
  @include respond-to-custom($sidebar-hide-bp) {
    @include asset-card-width(33%);
  }
  @include respond-to(small) {
    @include asset-card-width(50%);
  }
  @include respond-to(xsmall) {
    @include asset-card-width(100%);
  }
}

.balance-card-viewer__header {
  border-radius: 0.4rem 0.4rem 0 0;
  height: $asset-card-header-height;
  background-color: $col-asset-card-header-background;
  padding-top: 1.5rem;
}

.balance-card-viewer__logo {
  margin: 0 auto;
}

.balance-card-viewer__info {
  padding: 1.6rem 2rem;
  // wait for 10.0.2 stylelint version
  /* stylelint-disable function-calc-no-invalid */
  height: calc(100% - #{$asset-card-header-height});
  /* stylelint-enable function-calc-no-invalid */
  display: flex;
  flex-direction: column;
}

.balance-card-viewer__code {
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-asset-card-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
}

.balance-card-viewer__name {
  margin-top: 0.2rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-asset-card-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
}

.balance-card-viewer__balance {
  font-size: 1.2rem;
  line-height: 1.5;
  color: $col-asset-card-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: auto;
}
</style>
