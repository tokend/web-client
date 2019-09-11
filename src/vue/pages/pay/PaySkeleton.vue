<template>
  <div class="skeleton-loader-pay">
    <div class="pay__asset-information">
      <div class="asset-information__header">
        <skeleton-loader
          template="bigIcon"
        />
        <div class="asset-information__info">
          <skeleton-loader
            class="skeleton-loader-pay__asset-name"
            template="smallString"
          />
        </div>
      </div>
      <div
        class="asset-information__description"
      >
        <skeleton-loader
          template="smallString"
        />
        <skeleton-loader
          template="fieldViewer"
        />
      </div>
    </div>
    <div class="pay__form">
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
            <skeleton-loader
              template="fieldViewer"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <skeleton-loader
              template="fieldViewer"
            />
          </div>
        </div>

        <div class="app__form-actions">
          <skeleton-loader
            template="mediumButton"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import SkeletonLoaderField from '@/vue/common/skeleton-loader/SkeletonLoaderField'

export default {
  name: 'skeleton-loader-pay',
  components: {
    SkeletonLoader,
    SkeletonLoaderField,
  },
}
</script>

<style scoped lang="scss">
@import '@/vue/forms/_app-form';
@import '~@scss/variables.scss';
@import '~@scss/mixins.scss';

$media-small-desktop: 960px;

.skeleton-loader-pay {
  padding: 2.4rem;
  display: flex;
  justify-content: space-between;

  @include box-shadow();
  @include respond-to-custom($media-small-desktop) {
    flex-direction: column;
    margin: 4rem 0;
  }
}

.skeleton-loader-pay__asset-name {
  min-width: 10rem;
}
</style>
