<template>
  <div class="poll-card">
    <p class="poll-card__title">
      <skeleton-loader width="100%" template="bigString" />
      <skeleton-loader width="80%" template="bigString" />
    </p>

    <div class="poll-card__status">
      <skeleton-loader width="45%" template="smallString" />
    </div>

    <p class="poll-card__author">
      <skeleton-loader width="60%" template="smallString" />
    </p>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import PollCard from './PollCard.vue'

export default {
  name: 'poll-card-skeleton',

  components: {
    SkeletonLoader,
  },

  extends: PollCard,

  props: {
    poll: {
      type: Object,
      required: false,
      default: null,
    },
  },
}
</script>
