<template>
  <form
    class="app__form"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <skeleton-loader-field />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <skeleton-loader-field />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <skeleton-loader-field />
      </div>
    </div>

    <div class="app__form-actions">
      <skeleton-loader
        template="mediumButton"
      />
    </div>
  </form>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import SkeletonLoaderField from '@/vue/common/skeleton-loader/SkeletonLoaderField'

export default {
  name: 'skeleton-loader-step-form',
  components: {
    SkeletonLoader,
    SkeletonLoaderField,
  },
}
</script>

<style scoped lang="scss">
@import '@/vue/forms/_app-form';
</style>
