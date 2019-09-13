<template>
  <div class="pay-skeleton">
    <div class="pay-skeleton__asset-viewer">
      <div class="pay-skeleton__asset-header">
        <skeleton-loader
          template="bigIcon"
        />
        <skeleton-loader
          class="pay-skeleton__asset-name"
          template="smallString"
        />
      </div>
      <div
        class="pay-skeleton__asset-description"
      >
        <skeleton-loader
          template="smallString"
        />
        <skeleton-loader
          template="fieldViewer"
        />
      </div>
    </div>
    <div class="pay-skeleton__form">
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
  name: 'pay-skeleton',
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

.pay-skeleton {
  padding: 2.4rem;
  display: flex;
  justify-content: space-between;

  @include box-shadow();
  @include respond-to-custom($media-small-desktop) {
    flex-direction: column;
    margin: 4rem 0;
  }
}

.pay-skeleton__asset-header {
  display: flex;
  align-items: center;
}

.pay-skeleton__asset-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-primary;
  margin-left: 1.8rem;
  min-width: 10rem;
}

.pay-skeleton__asset-description {
  margin-top: 2rem;
}

.pay-skeleton__form {
  width: 50%;
  padding-left: 1.5%;

  @include respond-to-custom($media-small-desktop) {
    width: 100%;
    padding-left: 0;
  }
}

.pay-skeleton__asset-viewer {
  width: 50%;
  padding-right: 1.5%;
  border-right: 0.2rem solid $col-border;

  @include respond-to-custom($media-small-desktop) {
    width: 100%;
    padding-right: 0;
    border-right: none;
    margin-bottom: 2rem;
  }
}
</style>
