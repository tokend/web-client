<template>
  <div class="timeline-item">
    <h3 class="timeline-item__title">{{ title }}</h3>
    <span class="timeline-item__date">{{ date }}</span>
    <!-- eslint-disable-next-line -->
    <p class="timeline-item__message" v-html="message" />
  </div>
</template>

<script>
export default {
  name: 'updates-timeline-item',
  props: {
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    date: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../../scss/variables";

  .timeline-item__date {
    color: lighten($col-text-field-hint, 10%);
    font-weight: bold;
  }

  .timeline-item__title {
    margin-bottom: 0.75rem;
  }

  .timeline-item {
    margin-bottom: 2rem;
  }

</style>
