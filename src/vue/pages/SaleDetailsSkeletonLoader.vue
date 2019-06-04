<template>
  <div class="sale-details-skeleton-loader">
    <top-bar>
      <template>
        <skeleton-loader
          template="smallString"
        />
        <skeleton-loader
          template="smallString"
        />
        <skeleton-loader
          template="smallString"
        />
      </template>
    </top-bar>

    <div class="sale-details-skeleton-loader__title">
      <skeleton-loader
        class="sale-details-skeleton-loader__name"
        template="bigString"
      />

      <skeleton-loader
        class="sale-details-skeleton-loader__short-desc"
        template="smallString"
      />
    </div>
    <div class="sale-details-skeleton-loader">
      <div class="sale-details-skeleton-loader__actions-wrp">
        <skeleton-loader
          class="sale-details-skeleton-loader__action-btn"
          template="mediumButton"
        />
      </div>
    </div>

    <div class="sale-details-skeleton-loader__content">
      <div class="sale-details-skeleton-loader__description">
        <div class="sale-logo-viewer">
          <skeleton-loader
            template="fillMode"
          />
        </div>
        <div class="sale-description-viewer">
          <skeleton-loader
            template="smallString"
          />
        </div>
      </div>

      <div class="sale-details-skeleton-loader__state">
        <div class="sale-state-widget">
          <skeleton-loader
            class="sale-state-widget__invested"
            template="bigString"
          />

          <skeleton-loader
            class="sale-state-widget__funded"
            template="smallString"
          />

          <div class="sale-state-widget__progress-bar">
            <div
              class="sale-state-widget__progress"
              :style="`width: ${0}%`"
            />
          </div>

          <template>
            <skeleton-loader
              class="sale-state-widget__days-to-go"
              template="bigString"
            />
          </template>

          <template>
            <skeleton-loader
              class="sale-state-widget__days-after-end"
              template="smallString"
            />
          </template>

          <skeleton-loader
            class="sale-state-widget__invest-btn"
            template="mediumButton"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import TopBar from '@/vue/common/TopBar'

export default {
  name: 'sale-details-skeleton-loader-skeleton-loader',
  components: {
    TopBar,
    SkeletonLoader,
  },
}
</script>

<style scoped lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.sale-details-skeleton-loader {
  margin-top: 2rem;
}

.sale-details-skeleton-loader__actions-wrp {
  display: flex;
  margin: -1rem -1rem 1.4rem;
}

.sale-details-skeleton-loader__action-btn {
  margin: 1rem;
}

.sale-details-skeleton-loader__content {
  display: flex;
  align-items: flex-start;
  margin: -1.6rem;

  @include respond-to($small) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}

.sale-details-skeleton-loader__description {
  flex-basis: 64%;
  background-color: $col-sale-details-block;
  border-radius: 0.4rem;
  margin: 1.6rem;
  overflow: auto;

  @include respond-to($x-medium) {
    flex-basis: 55%;
  }
}

.sale-details-skeleton-loader__state {
  flex-basis: 36%;
  background-color: $col-sale-details-block;
  border-radius: 0.4rem;
  margin: 1.6rem;
  padding: 3.3rem 3.4rem 2.2rem 2.4rem;

  @include respond-to($x-medium) {
    flex-basis: 45%;
  }
}

.sale-logo-viewer {
  background-color: $col-sale-details-logo-bg;
  position: relative;
  height: 36rem;
  width: 100%;

  @include respond-to($x-medium) {
    height: 24rem;
  }
}

.sale-logo-viewer__img {
  position: absolute;
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.sale-description-viewer {
  padding: 3.2rem;
}

.sale-state-widget__invested,
.sale-state-widget__days-to-go,
.sale-state-widget__progress-bar {
  margin-bottom: 1.6rem;
}

.sale-details-skeleton-loader__name {
  margin-bottom: 0.8rem;
}

.sale-state-widget__invest-btn {
  margin-top: 3.2rem;
  max-width: 18rem;
  width: 100%;
}

.sale-state-widget__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: 0.3rem;
  background-color: $col-sale-details-progress-bar-bg;
}
</style>
