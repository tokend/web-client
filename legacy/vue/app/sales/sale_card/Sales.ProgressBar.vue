<template>
  <div class="invest-progress-bar">
    <div class="invest-progress-bar__details">
      <span class="invest-progress-bar__detail">
        Buy
        <span class="invest-progress-bar__detail-value">
          {{ i18n.c(sale.baseHardCap) }}
        </span>
        {{ sale.baseAsset }} for
        <span class="invest-progress-bar__detail-value">
          {{ i18n.c(sale.hardCap) }}
        </span>
        {{ sale.defaultQuoteAsset }}
      </span>
    </div>
    <div class="invest-progress-bar__container">
      <div
        class="invest-progress-bar__progress"
        :style="`width: ${progress}%`"
      />
    </div>
    <div class="invest-progress-bar__details">
      <span class="invest-progress-bar__detail">
        <span class="invest-progress-bar__detail-value">
          {{ i18n.n(sale.currentCap) }} {{ sale.defaultQuoteAsset }}
        </span>
        invested
      </span>
      <span class="invest-progress-bar__detail">
        <span class="invest-progress-bar__detail-value">{{ daysLeft }}</span>
        days to go
      </span>
    </div>
  </div>
</template>

<script>
import { i18n } from 'L@/js/i18n'
export default {
  name: 'invest-progress-bar',
  props: {
    sale: { type: Object, default: () => {} }
  },
  data: _ => ({
    i18n
  }),
  computed: {
    progress () {
      const progress = Math.ceil(
        (this.sale.currentCap / this.sale.hardCap) * 100
      )
      return progress >= 100 ? 100 : progress
    },
    daysLeft () {
      const start = new Date(this.sale.startTime)
      const finish = new Date(this.sale.endTime)
      const diff = parseInt((finish - start) / (1000 * 60 * 60 * 24))
      return diff
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';
  @import '~L@scss/mixins';

  .invest-progress-bar {
    color: $col-fund-card-text;
  }

  .invest-progress-bar__container {
    background: $col-fund-card-progress-background;
    height: 0.2rem;
    margin: .5rem 0;
    width: 100%;
  }

  .invest-progress-bar__progress {
    background: $col-fund-card-progress-color;
    height: 100%;
  }

  .invest-progress-bar__details {
    display: flex;
    justify-content: space-between;
  }

  .invest-progress-bar__detail {
    font-size: .8rem;

    .invest-progress-bar__detail-value {
      color: $col-text-accented;
    }
  }
</style>
