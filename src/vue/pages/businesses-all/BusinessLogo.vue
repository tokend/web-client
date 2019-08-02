<template>
  <img
    v-if="url"
    class="business-logo business-logo--image"
    :src="url"
    :class="{ 'business-logo--full-cover' : isFullCover }"
  >
  <p
    v-else
    class="business-logo business-logo--abbr"
    :class="{ 'business-logo--dark' : darkMode }"

  >
    {{ getFirstLetterOfName }}
  </p>
</template>

<script>
import { BusinessRecord } from '@/js/records/entities/business.record'
import { documentsManager } from '@/api'

export default {
  name: 'business-logo',
  props: {
    business: { type: BusinessRecord, required: true },
    isFullCover: { type: Boolean, default: false },
    darkMode: { type: Boolean, default: false },
  },
  computed: {
    url () {
      return documentsManager.getDocumentUrlByKey(this.business.logoKey)
    },
    getFirstLetterOfName () {
      const name = this.business.name
      return name.substr(0, 1).toUpperCase()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.business-logo {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;

  &--image {
    display: block;
  }

  &--abbr {
    font-size: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $col-asset-logo-background;
    color: $col-asset-logo-text;
  }

  &--dark {
    background: $col-asset-logo-dark-background;
    color: $col-asset-logo-dark-text;
  }

  &--full-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
}
</style>
