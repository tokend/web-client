<template>
  <a
    class="fund-card"
    @click="$emit(EVENTS.select)"
  >
    <div class="fund-card__header">
      <img
        class="fund-card__logo"
        :src="fund.logoUrl(config.FILE_STORAGE)"
      >
    </div>

    <div class="fund-card__info">
      <p class="fund-card__name">
        {{ fund.name }}
      </p>

      <p class="fund-card__desc">
        {{ fund.shortDescription }}
      </p>

      <div class="fund-card__progress-bar">
        <div
          class="fund-card__progress"
          :style="`width: ${capProgress}%`"
        />
      </div>

      <p class="fund-card__funded">
        <!-- eslint-disable max-len -->
        {{ 'fund-card.funded' | globalize({ funded: fund.currentCap / fund.hardCap }) }}
        <!-- eslint-enable max-len -->
      </p>

      <p class="fund-card__invested">
        <!-- eslint-disable max-len -->
        {{ 'fund-card.invested' | globalize({ invested: { value: fund.currentCap, currency: fund.defaultQuoteAsset } }) }}
        <!-- eslint-enable max-len -->
      </p>

      <p class="fund-card__days-to-launch">
        <!-- eslint-disable max-len -->
        {{ 'fund-card.days-to-launch' | globalize({ days: fund.daysToGo }) }}
        <!-- eslint-enable max-len -->
      </p>

      <vue-markdown
        class="fund-card__offer"
        :source="'fund-card.offer' | globalize({
          baseHardCap: {
            value: fund.baseHardCap,
            currency: fund.baseAsset
          },
          hardCap: {
            value: fund.hardCap,
            currency: fund.defaultQuoteAsset
          }
        })"
        :html="false"
      />
    </div>
  </a>
</template>

<script>
import VueMarkdown from 'vue-markdown'

import { SaleRecord } from '@/js/records/entities/sale.record'

import config from '@/config'

const EVENTS = {
  select: 'select',
}

export default {
  name: 'fund-card',
  components: {
    VueMarkdown,
  },

  props: {
    fund: { type: SaleRecord, required: true },
  },

  data: _ => ({
    config,
    EVENTS,
  }),

  computed: {
    capProgress () {
      const capPercentage = (this.fund.currentCap / this.fund.hardCap) * 100
      const progress = Math.round(capPercentage * 100) / 100

      return progress >= 100 ? 100 : progress
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.fund-card {
  cursor: pointer;
  border-radius: .4rem;
  box-shadow: 0 .5rem 1rem 0 $col-fund-card-shadow;
  background-color: $col-fund-card-background;
  margin: 1rem;
}

.fund-card__header {
  position: relative;
  border-radius: .4rem .4rem 0rem 0rem;
  height: 16rem;
  width: 100%;
  background-color: $col-fund-card-header-background;

  @include respond-to($x-medium) {
    height: 12rem;
  }
}

.fund-card__logo {
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

.fund-card__info {
  padding: 2.2rem 1.5rem;
}

.fund-card__name {
  font-size: 1.8rem;
  font-weight: bold;
  color: $col-fund-card-text-primary;
}

.fund-card__desc {
  margin-top: .5rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-fund-card-text-primary;
}

.fund-card__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: .3rem;
  background-color: $col-fund-card-progress-bar-background;

  .fund-card__progress {
    background: $col-fund-card-progress-bar-value;
    height: 100%;
  }
}

.fund-card__funded {
  margin-top: .9rem;
}

.fund-card__funded, .fund-card__invested, .fund-card__days-to-launch {
  font-size: 1.3rem;
  color: $col-fund-card-text-primary;
  line-height: 1.69;
}

.fund-card__offer {
  margin-top: 2.5rem;
  font-size: 1.4rem;
  color: $col-fund-card-text-primary;

  strong {
    color: $col-fund-card-text-bold;
  }
}
</style>
