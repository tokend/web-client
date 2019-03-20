<template>
  <router-link
    class="sale-card"
    :to="{ ...vueRoutes.saleDetails, params: { id: sale.id } }"
  >
    <div class="sale-card__header">
      <img
        class="sale-card__logo"
        :src="sale.logoUrl(config.FILE_STORAGE)"
      >
    </div>

    <div class="sale-card__info">
      <p class="sale-card__name">
        {{ sale.name }}
      </p>

      <p class="sale-card__desc">
        {{ sale.shortDescription }}
      </p>

      <div class="sale-card__progress-bar">
        <div
          class="sale-card__progress"
          :style="`width: ${capProgress}%`"
        />
      </div>

      <p class="sale-card__funded">
        <!-- eslint-disable max-len -->
        {{ 'sale-card.funded' | globalize({ funded: sale.currentCap / sale.hardCap }) }}
        <!-- eslint-enable max-len -->
      </p>

      <p class="sale-card__invested">
        <!-- eslint-disable max-len -->
        {{ 'sale-card.invested' | globalize({ invested: { value: sale.currentCap, currency: sale.defaultQuoteAsset } }) }}
        <!-- eslint-enable max-len -->
      </p>

      <p class="sale-card__days-to-launch">
        <template v-if="sale.daysToGo < 0">
          {{ 'sale-card.days-after-the-end' | globalize({
            days: sale.daysAfterTheEnd
          })
          }}
        </template>

        <template v-else>
          {{ 'sale-card.days-to-launch' | globalize({ days: sale.daysToGo }) }}
        </template>
      </p>

      <vue-markdown
        class="sale-card__offer"
        :source="'sale-card.offer' | globalize({
          baseHardCap: {
            value: sale.baseHardCap,
            currency: sale.baseAsset
          },
          hardCap: {
            value: sale.hardCap,
            currency: sale.defaultQuoteAsset
          }
        })"
        :html="false"
      />
    </div>
  </router-link>
</template>

<script>
import VueMarkdown from 'vue-markdown'

import { SaleRecord } from '@/js/records/entities/sale.record'

import config from '@/config'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'sale-card',
  components: {
    VueMarkdown,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    config,
    vueRoutes,
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
@import "~@scss/variables";
@import "~@scss/mixins";

.sale-card {
  cursor: pointer;
  border-radius: .4rem;
  box-shadow: 0 .5rem 1rem 0 $col-sale-card-shadow;
  background-color: $col-sale-card-background;
  margin: 1rem;
  text-decoration: none;
  color: inherit;
}

.sale-card__header {
  position: relative;
  border-radius: .4rem .4rem 0rem 0rem;
  height: 16rem;
  width: 100%;
  background-color: $col-sale-card-header-background;

  @include respond-to($x-medium) {
    height: 12rem;
  }
}

.sale-card__logo {
  border-radius: .4rem .4rem 0rem 0rem;
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.sale-card__info {
  padding: 2.2rem 1.5rem;
}

.sale-card__name {
  font-size: 1.8rem;
  font-weight: bold;
  color: $col-sale-card-text-primary;
}

.sale-card__desc {
  margin-top: .5rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-sale-card-text-primary;
}

.sale-card__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: .3rem;
  background-color: $col-sale-card-progress-bar-background;

  .sale-card__progress {
    background: $col-sale-card-progress-bar-value;
    height: 100%;
  }
}

.sale-card__funded {
  margin-top: .9rem;
}

.sale-card__funded, .sale-card__invested, .sale-card__days-to-launch {
  font-size: 1.3rem;
  color: $col-sale-card-text-primary;
  line-height: 1.69;
}

.sale-card__offer {
  margin-top: 2.5rem;
  font-size: 1.4rem;
  color: $col-sale-card-text-primary;

  strong {
    color: $col-sale-card-text-bold;
  }
}
</style>
