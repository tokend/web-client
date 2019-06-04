<template>
  <div class="skeleton-loader-field">
    <skeleton-loader
      template="xSmallString"
    />
    <skeleton-loader
      template="fieldViewer"
    />
  </div>
</template>

<script>
import SkeletonLoader from './SkeletonLoader'

export default {
  name: 'skeleton-loader-field',
  components: { SkeletonLoader },
}
</script>

<style scoped lang="scss">
.skeleton-loader-field {
  padding: 0.6rem 0;
  height: 4.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
