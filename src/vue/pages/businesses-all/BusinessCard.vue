<template>
  <div class="business-card">
    <div class="business-card__logo-wrp">
      <business-logo
        class="business-card__logo"
        :business="business"
        is-full-cover
      />
    </div>

    <div class="business-card__info">
      <p
        :title="business.name"
        class="business-card__name"
      >
        {{ business.name }}
      </p>
      <p
        :title="business.industry"
        class="business-card__industry"
      >
        {{ business.industry ? business.industry : '&nbsp;' }}
      </p>
    </div>
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
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

$business-card-header-height: 12.5rem;

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

.business-card__logo-wrp {
  border-radius: 0.4rem 0.4rem 0 0;
  height: $business-card-header-height;
  background-color: $col-asset-card-header-background;
  display: flex;
  align-items: center;
}

.business-card__logo {
  margin: 0 auto;
}

.business-card__info {
  padding: 1.6rem 2rem;
  height: calc(100% - #{$business-card-header-height});
  display: flex;
  flex-direction: column;
}

.business-card__name {
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-asset-card-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.business-card__industry {
  margin-top: 0.2rem;
  font-size: 1.05rem;
  line-height: 1.29;
  opacity: 0.54;
  color: $col-asset-card-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
