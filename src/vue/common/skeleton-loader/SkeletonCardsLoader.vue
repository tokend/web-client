<template>
  <div class="skeleton-cards-loader__wrapper">
    <div
      class="skeleton-cards-loader"
      v-for="(item, index) in numberOfCards"
      :key="index"
    >
      <div class="skeleton-cards-loader__media">
        <skeleton-loader template="bigIcon" />
      </div>
      <div class="skeleton-cards-loader__body">
        <div class="skeleton-cards-loader__header">
          <skeleton-loader
            template="smallString"
            width="60%"
          />
        </div>
        <div class="skeleton-cards-loader__subhead">
          <skeleton-loader
            template="smallString"
            width="45%"
          />
        </div>
        <div class="skeleton-cards-loader__content">
          <p class="skeleton-cards-loader__content-text">
            <skeleton-loader
              template="smallString"
              width="100%"
            />
            <skeleton-loader
              template="smallString"
              width="100%"
            />
          </p>
        </div>
      </div>
      <div class="skeleton-cards-loader__actions">
        <skeleton-loader template="smallButton" />
      </div>
    </div>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

export default {
  name: 'skeleton-cards-loader',

  components: {
    SkeletonLoader,
  },

  data: _ => ({
    numberOfCards: 4,
  }),
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  $content-line-height: 1.8rem;
  $content-number-text-lien: 2;
  $content-height: $content-line-height * $content-number-text-lien;

  .skeleton-cards-loader__wrapper {
    display: grid;
    grid-gap: $card-list-grid-gap;
    grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
  }

  .skeleton-cards-loader {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    border-radius: 0.4rem;
    box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
    background-color: $col-sale-card-background;
    min-width: 0;
  }

  .skeleton-cards-loader__media {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    padding: 2rem;
    background-color: $col-asset-card-header-background;
  }

  .skeleton-cards-loader__body {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    padding: 1.6rem 2rem;
  }

  .skeleton-cards-loader__header {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 2rem;
    line-height: 2.66rem;
    font-weight: 500;
    color: $col-text;
  }

  .skeleton-cards-loader__subhead {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.16rem;
    line-height: 1.65rem;
    color: $col-text;
    opacity: 0.54;
  }

  .skeleton-cards-loader__content {
    margin-top: 1rem;
    height: $content-height;
    max-height: $content-height;
  }

  .skeleton-cards-loader__content-text {
    @include multi-line-ellipsis(
        $content-line-height,
        $content-number-text-lien,
        falce,
        $col-sale-card-background,
        15ch
    );
  }

  .skeleton-cards-loader__actions {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
  }

</style>
