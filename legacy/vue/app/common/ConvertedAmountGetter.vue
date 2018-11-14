<template>
  <span class="converted-amount-getter" v-if="isLoading">
    {{ i18n.lbl_loading() }}
  </span>
  <span class="converted-amount-getter" v-else>
    {{ converted || '-' }} {{ defaultQuoteAsset }}
  </span>
</template>

<script>
import { pairsService } from 'L@/js/services/pairs.service'
import { i18n } from 'L@/js/i18n'
import config from '@/config'
export default {
  props: {
    amount: { type: [String, Number], required: true },
    asset: { type: String, required: true }
  },
  data: _ => ({
    converted: null,
    defaultQuoteAsset: config.DEFAULT_QUOTE_ASSET,
    isLoading: false,
    i18n
  }),
  created () {
    this.getConverted()
  },
  methods: {
    async getConverted () {
      this.isLoading = true
      try {
        this.converted = await pairsService.loadConvertedAmount(
          this.amount,
          this.asset,
          this.defaultQuoteAsset
        )
      } catch (e) {
        console.error(e)
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
