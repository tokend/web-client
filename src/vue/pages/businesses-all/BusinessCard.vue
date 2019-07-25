<template>
  <div class="business-card">
    <div class="business-card__logo-wrp">
      <business-logo
        class="business-card__logo"
        :business="business"
        :name="business.name"
      />
    </div>

    <p class="business-card__name">
      {{ business.name }}
    </p>
  </div>
</template>

<script>

import { CorporateRecord } from '@/js/records/entities/business.record'

import BusinessLogo from './BusinessLogo'

export default {
  name: 'business-card',

  components: {
    BusinessLogo,
  },

  props: {
    business: {
      type: CorporateRecord,
      required: true,
    },
  },

  methods: {
    translatePollStateInline (business) {
      let translationId

      if (business.isOpen) {
        translationId = 'business-card.state-inline-open'
      } else if (business.isPassed) {
        translationId = 'business-card.state-inline-passed'
      } else if (business.isFailed) {
        translationId = 'business-card.state-inline-failed'
      } else if (business.isCanceled) {
        translationId = 'business-card.state-inline-canceled'
      }

      return this.$options.filters.globalize(translationId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.business-card {
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
  background-color: $col-sale-card-background;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  overflow-x: hidden;
}

.business-card__name {
  font-size: 1.6em;
  text-align: center;
  padding: 1.6rem 2.4rem;
}
</style>
