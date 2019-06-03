<template>
  <div
    class="sale-skeleton-loader"
  >
    <div class="sale-skeleton-loader__header">
      <skeleton-loader
        class="sale-skeleton-loader__logo"
        template="imageViewer"
      />
    </div>

    <div class="sale-skeleton-loader__info">
      <skeleton-loader
        class="sale-skeleton-loader__name"
        template="bigString"
      />

      <skeleton-loader
        class="sale-skeleton-loader__desc"
        template="smallString"
      />

      <div class="sale-skeleton-loader__progress-bar">
        <div
          class="sale-skeleton-loader__progress"
          :style="`width: ${0}%`"
        />
      </div>

      <skeleton-loader
        class="sale-skeleton-loader__funded"
        template="smallString"
      />

      <skeleton-loader
        class="sale-skeleton-loader__invested"
        template="smallString"
      />

      <skeleton-loader
        class="sale-skeleton-loader__days-to-launch"
        template="smallString"
      />

      <skeleton-loader
        class="sale-skeleton-loader__offer"
        template="bigString"
      />
    </div>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

export default {
  name: 'sale-skeleton-loader',
  components: { SkeletonLoader },
}
</script>

<style scoped lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.sale-skeleton-loader {
  cursor: pointer;
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
  background-color: $col-sale-card-background;
  margin: 1rem;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.sale-skeleton-loader__header {
  position: relative;
  border-radius: 0.4rem 0.4rem 0 0;
  height: 16rem;
  width: 100%;
  background-color: $col-sale-card-header-background;

  @include respond-to($x-medium) {
    height: 12rem;
  }
}

.sale-skeleton-loader__logo {
  border-radius: 0.4rem 0.4rem 0 0;
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.sale-skeleton-loader__info {
  padding: 2.2rem 1.5rem;
}

.sale-skeleton-loader__name {
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-sale-card-text-primary;
}

.sale-skeleton-loader__desc {
  margin-top: 1rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-sale-card-text-primary;
}

.sale-skeleton-loader__name,
.sale-skeleton-loader__desc {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sale-skeleton-loader__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: 0.3rem;
  background-color: $col-sale-card-progress-bar-background;
}

.sale-skeleton-loader__progress {
  background: $col-sale-card-progress-bar-value;
  height: 100%;
}

.sale-skeleton-loader__funded,
.sale-skeleton-loader__invested,
.sale-skeleton-loader__days-to-launch {
  margin-top: 0.9rem;
  font-size: 1.3rem;
  color: $col-sale-card-text-primary;
  line-height: 1.69;
}

.sale-skeleton-loader__offer {
  margin-top: 2.5rem;
  font-size: 1.4rem;
  color: $col-sale-card-text-primary;

  /* stylelint-disable selector-nested-pattern */
  strong {
    color: $col-sale-card-text-bold;
  }
  /* stylelint-enable selector-nested-pattern */
}
</style>
