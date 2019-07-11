<template>
  <div class="business-card">
    <p class="business-card__title">
      <skeleton-loader width="100%" template="bigString" />
      <skeleton-loader width="80%" template="bigString" />
    </p>

    <div class="business-card__status">
      <skeleton-loader width="45%" template="smallString" />
    </div>

    <p class="business-card__author">
      <skeleton-loader width="60%" template="smallString" />
    </p>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import BusinessCard from './BusinessCard.vue'

export default {
  name: 'business-card-skeleton',

  components: {
    SkeletonLoader,
  },

  extends: BusinessCard,

  props: {
    business: {
      type: Object,
      required: false,
      default: null,
    },
  },
}
</script>
