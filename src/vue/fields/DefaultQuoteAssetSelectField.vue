<template>
  <div
    class="default-quote-asset-select-field"
  >
    <template v-if="isLoaded && baseAssets.length">
      <select-field
        name="default-quote-asset"
        v-model="defaultQuoteAsset"
        @input="setDefaultQuoteAsset"
        class="
          default-quote-asset-select-field__asset-select
          app__select-with-label--no-border
          app__select-panel--right
        "
      >
        <option
          v-for="asset in baseAssets"
          :key="asset.code"
          :value="asset.code"
        >
          {{ asset.code }}
        </option>
      </select-field>
    </template>
    <template v-else>
      {{ 'default-quote-asset-select-field.not-set-msg' | globalize }}
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'default-quote-asset-select-field',

  mixins: [FormMixin],

  data: _ => ({
    defaultQuoteAsset: '',
    isLoaded: false,
  }),

  computed: {
    ...mapGetters({
      baseAssets: vuexTypes.fiatAssets,
      statsQuoteAsset: vuexTypes.statsQuoteAsset,
      accountId: vuexTypes.accountId,
    }),
  },

  async created () {
    await this.loadAccountBalances()
    this.defaultQuoteAsset = this.statsQuoteAsset
    this.isLoaded = true
  },

  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
      loadStatsQuoteAsset: vuexTypes.LOAD_STATS_QUOTE_ASSET,
    }),

    async setDefaultQuoteAsset () {
      if (this.isDefaultQuoteAssetChanged()) return
      const endpoint = `/integrations/dns/businesses/${this.accountId}/settings/quote-asset`
      try {
        await api.postWithSignature(endpoint, {
          data: {
            type: 'stats-quote-asset',
            attributes: {
              qoute_asset: this.defaultQuoteAsset,
            },
          },
        })
        Bus.success('default-quote-asset-select-field.set-asset-msg')
        await this.loadStatsQuoteAsset()
      } catch (error) {
        ErrorHandler.process(error)
      }
    },

    isDefaultQuoteAssetChanged () {
      return this.statsQuoteAsset === this.defaultQuoteAsset
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
