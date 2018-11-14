<template>
  <div class="assets-select">
    <template v-if="pairs.length">
      <select-field-custom
        class="assets-select__select"
        v-model="currentAsset"
        :label="i18n.lbl_asset()"
        :values="sortedPairs"
        :key="currentAsset" />
    </template>

    <div class="asset-select__balances">
      <p class="asset-select__balances-label">
        {{ i18n.trd_balance_label() }}
      </p>
      <p class="asset-select__balances-value">
        {{ i18n.trd_balance({base: baseAmount, quote: quoteAmount}) }}
      </p>
    </div>
  </div>
</template>

<script>
import SelectFieldCustom from 'L@/vue/common/fields/SelectFieldCustom'

import { dispatchAppEvent } from 'L@/js/events/helpers'
import { commonEvents } from 'L@/js/events/common_events'
import { mapGetters } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
import { i18n } from 'L@/js/i18n'
import config from '@/config'

export default {
  components: { SelectFieldCustom },
  props: {
    pairs: { type: Array, require: true, default: () => [] }
  },
  data () {
    return {
      currentAsset: '',
      baseAmount: '',
      quoteAmount: '',
      i18n
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances
    ]),
    sortedPairs () {
      if (!this.pairs.length) return
      let pairsTmp = [].concat(this.pairs)

      const priorityRexes = config.DEFAULT_TRADE_PAIRS_RE
      const prioritized = []

      for (const pair of pairsTmp) {
        for (const re of priorityRexes) {
          if (re.test(pair)) {
            prioritized.push(pair)
            pairsTmp = pairsTmp.filter(item => item !== pair)
            break
          }
        }
      }

      return [...prioritized, ...pairsTmp]
    }
  },
  watch: {
    'currentAsset' (value) {
      dispatchAppEvent(commonEvents.changePairsAsset, value)
      this.handleAssetChange(value)
    }
  },
  created () {
    this.currentAsset = this.currentAsset ||
      this.tryFindDefaultPair(this.pairs) ||
      this.pairs[0] ||
      null
  },
  methods: {
    tryFindDefaultPair (pairs) {
      const fallbackResult = null
      if (!pairs || !pairs.length) return fallbackResult

      let result = fallbackResult
      const criteriaRexes = config.DEFAULT_TRADE_PAIRS_RE
      for (const criteriaRe of criteriaRexes) {
        result = pairs.filter(pair => criteriaRe.test(pair))[0]
        if (result) break
      }

      return result
    },
    handleAssetChange (payload) {
      const base = payload.split('/')[0]
      const quote = payload.split('/')[1]
      const baseBalance = this.accountBalances[base]
      this.baseAmount = baseBalance ? `${i18n.c(baseBalance.balance)} ${base}` : `${i18n.c(0)} ${base}`
      this.quoteAmount = `${i18n.c(this.accountBalances[quote].balance)} ${quote}`
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~L@scss/variables";

  .assets-select {
    margin-bottom: -70px;
  }

  .assets-select__select {
    display: inline-block;
    width: auto;
    &:not(:last-child) {
      margin-right: 1.5 * $point;
    }
  }

  .asset-select__balances {
    margin: 2 * $point 0 4 * $point;

    .asset-select__balances-label {
      font-size: 1.2 * $point;
      color: $col-text-inactive;
    }

    .asset-select__balances-value {
      font-size: 1.8 * $point;
      color: $col-text;
    }
  }
</style>
