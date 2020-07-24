<template>
  <div class="card">
    <div
      v-if="isSlotDisplayed(SLOT_NAMES.media)"
      class="card__media"
    >
      <slot :name="SLOT_NAMES.media" />
    </div>
    <div class="card__body">
      <div
        v-if="isSlotDisplayed(SLOT_NAMES.header)"
        class="card__header"
      >
        <slot :name="SLOT_NAMES.header" />
      </div>
      <div
        v-if="isSlotDisplayed(SLOT_NAMES.subhead)"
        class="card__subhead"
      >
        <slot :name="SLOT_NAMES.subhead" />
      </div>
      <div
        v-if="isSlotDisplayed(SLOT_NAMES.accentTitle)"
        class="card__accent-title"
      >
        <slot :name="SLOT_NAMES.accentTitle" />
      </div>
      <div
        class="card__content"
        v-if="isSlotDisplayed(SLOT_NAMES.content)"
      >
        <p class="card__content-text">
          <slot :name="SLOT_NAMES.content" />
        </p>
      </div>
    </div>
    <div
      v-if="isSlotDisplayed(SLOT_NAMES.actions)"
      class="card__actions"
    >
      <slot :name="SLOT_NAMES.actions" />
    </div>
  </div>
</template>

<script>
const SLOT_NAMES = {
  media: 'media',
  header: 'header',
  subhead: 'subhead',
  accentTitle: 'accent-title',
  content: 'content',
  actions: 'actions',
}
export default {
  name: 'card',
  data: _ => ({
    SLOT_NAMES,
  }),
  methods: {
    isSlotDisplayed (slotName) {
      return Boolean(this.$slots[slotName])
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';
  @import '~@scss/mixins';

  $subhead-line-height: 1.8rem;
  $header-line-height: 2.6rem;
  $accent-title-line-height: 1.8rem;
  $content-line-height: 1.8rem;
  $content-number-text-lien: 2;
  $content-height: $content-line-height * $content-number-text-lien;

  .card {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    border-radius: 0.4rem;
    box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
    background-color: $col-sale-card-background;
    min-width: 0;
  }

  .card__media {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .card__body {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    padding: 1.6rem 2rem;
  }

  .card__header {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 2rem;
    line-height: $header-line-height;
    font-weight: 500;
    color: $col-text;
    min-height: $header-line-height;
  }

  .card__subhead {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0.54;
    font-size: 1.4rem;
    line-height: $subhead-line-height;
    min-height: $subhead-line-height;
  }

  .card__accent-title {
    margin-top: 1rem;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $col-text-page-heading;
    opacity: 0.7;
    min-height: $accent-title-line-height;

    span {
      font-size: 1.4rem;
      line-height: $accent-title-line-height;
    }
  }

  .card__content {
    margin-top: 1rem;
    height: $content-height;
    max-height: $content-height;
  }

  .card__content-text {
    @include multi-line-ellipsis(
        $content-line-height,
        $content-number-text-lien,
        falce,
        $col-sale-card-background,
        15ch
    );
    opacity: 0.54;
  }

  .card__actions {
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
