<template>
  <router-link
    class="sale-card"
    :to="{ ...vueRoutes.saleDetails, params: { id: 1 } }"
  >
    <div class="sale-card__header">
      <img
        class="sale-card__logo"
        :src="sale.logo"
      >
    </div>

    <div class="sale-card__info">
      <p
        class="sale-card__name"
        :title="sale.name"
      >
        {{ sale.name }}
      </p>
    </div>
  </router-link>
</template>

<script>
import { SaleRecord } from '@/js/records/entities/sale.record'

import { vueRoutes } from '@/vue-router/routes'
import { SALE_STATES } from '@/js/const/sale-states'

export default {
  name: 'sale-card',

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    vueRoutes,
    SALE_STATES,
  }),

  computed: {
    capProgress () {
      const capPercentage = (this.sale.currentCap / this.sale.hardCap) * 100
      const progress = Math.round(capPercentage * 100) / 100

      return progress >= 100 ? 100 : progress
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.sale-card {
  cursor: pointer;
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
  background-color: $col-sale-card-background;
  margin: 1rem;
  text-decoration: none;
  color: inherit;
  min-width: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.sale-card__header {
  position: relative;
  border-radius: 0.4rem 0.4rem 0 0;
  height: 26rem;
  width: 100%;
  background-color: $col-sale-card-header-background;

  @include respond-to($x-medium) {
    height: 20rem;
  }
}

.sale-card__logo {
  border-radius: 0.4rem 0.4rem 0 0;
  max-height: 100%;
  max-width: 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  object-fit: cover;
}

.sale-card__info {
  padding: 2.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.sale-card__name {
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-sale-card-text-primary;
  flex: 1;
}

.sale-card__desc {
  margin-top: 0.5rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-sale-card-text-primary;
}

.sale-card__name,
.sale-card__desc {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sale-card__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: 0.3rem;
  background-color: $col-sale-card-progress-bar-background;
}

.sale-card__progress {
  background: $col-sale-card-progress-bar-value;
  height: 100%;
}

.sale-card__funded {
  margin-top: 0.9rem;
}

.sale-card__funded,
.sale-card__invested,
.sale-card__days-to-launch {
  font-size: 1.3rem;
  color: $col-sale-card-text-primary;
  line-height: 1.69;
}

.sale-card__offer {
  margin-top: 2.5rem;
  font-size: 1.4rem;
  color: $col-sale-card-text-primary;

  /* stylelint-disable selector-nested-pattern */
  strong {
    color: $col-sale-card-text-bold;
  }
  /* stylelint-enable selector-nested-pattern */
}
</style>
