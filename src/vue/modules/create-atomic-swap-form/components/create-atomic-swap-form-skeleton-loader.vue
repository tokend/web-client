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
        class="submit-btn"
        template="mediumButton"
      />
    </div>
  </form>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import SkeletonLoaderField from '@/vue/common/skeleton-loader/SkeletonLoaderField'

export default {
  name: 'create-atomic-swap-form-skeleton-loader',
  components: {
    SkeletonLoader,
    SkeletonLoaderField,
  },
}
</script>

<style scoped lang="scss">
@import '~@/vue/forms/app-form';

.submit-btn {
  max-width: 18rem;
  width: 100%;
}
</style>
