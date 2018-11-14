<template>
  <div class="timeline-item">
    <div class="timeline-item__header">
      <h3 class="timeline-item__title">{{ title }}</h3>
      <span class="timeline-item__date">({{ date }})</span>
    </div>
    <p class="timeline-item__message">{{ message }}</p>
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
  @import "~L@scss/variables";

  .timeline-item__date {
    color: lighten($col-text-field-hint, 10%);
    font-weight: bold;
  }

  .timeline-item__header {
    display: flex;
  }

  .timeline-item__title {
    margin-bottom: .75rem;
    margin-right: .5rem;
  }

  .timeline-item {
    margin-bottom: 2rem;
  }

</style>
