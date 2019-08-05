<template>
  <div
    class="default-quote-asset-select-field"
  >
    <template v-if="isLoading && baseAssets.length">
      <select-field
        name="default-quote-asset"
        v-model="defaultQuoteAsset"
        @input="setDefaultQuoteAsset"
        class="
      default-quote-asset-select-field__asset-select
      app__select-with-label--no-border
      app__select-panel--right"
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
    bussinessStatsQuoteAsset: '',
    isLoading: false,
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
    await this.getStatsQuoteAsset()
    this.defaultQuoteAsset = this.bussinessStatsQuoteAsset ||
        this.statsQuoteAsset.code
    this.isLoading = true
  },

  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async getStatsQuoteAsset () {
      try {
        const endpoint = `/integrations/dns/businesses/${this.accountId}`
        const { data } = await api.getWithSignature(endpoint)
        this.bussinessStatsQuoteAsset = data.statsQuoteAsset
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },

    async setDefaultQuoteAsset () {
      if (this.isSetSameDefaultQuoteAsset()) return
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
        await this.getStatsQuoteAsset()
      } catch (error) {
        ErrorHandler.process(error)
      }
    },

    isSetSameDefaultQuoteAsset () {
      return this.bussinessStatsQuoteAsset === this.defaultQuoteAsset
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
