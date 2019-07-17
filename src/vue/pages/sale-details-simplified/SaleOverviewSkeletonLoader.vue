<template>
  <div class="asset-details">
    <div class="asset-details__header">
      <skeleton-loader
        template="smallIcon"
      />
      <div class="asset-details__info">
        <skeleton-loader
          template="smallString"
        />
        <skeleton-loader
          template="smallString"
        />
      </div>
    </div>
    <div class="app__table asset-details__table">
      <table>
        <skeleton-loader-table-body
          :cells="2"
          :rows="3"
          template="smallString"
        />
      </table>
    </div>
    <div
      class="asset-details__buttons"
    >
      <skeleton-loader
        template="mediumButton"
      />
    </div>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'

export default {
  name: 'sale-overview-skeleton-loader',
  components: {
    SkeletonLoader,
    SkeletonLoaderTableBody,
  },
}
</script>

<style scoped lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

$media-xsmall-height: 375px;
$media-small-height: 460px;

.asset-details__table {
  margin-top: 4rem;

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
  @include respond-to-height($media-xsmall-height) {
    margin-top: 0.8rem;
  }
}

.asset-details__header {
  display: flex;
  align-items: center;
}

.asset-details__info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 3.7rem;
  margin-left: 1.8rem;
}

.asset-details__buttons {
  margin-top: 4.9rem;
  display: flex;

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
}
</style>
