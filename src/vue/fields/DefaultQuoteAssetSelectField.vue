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
          app__select-with-label--no-border
          app__select-panel--right
        "
      >
        <option
          v-for="asset in baseAssets"
          :key="asset.code"
          :value="asset.code"
        >
          {{ asset.name }}
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
      baseAssets: vuexTypes.baseAssets,
      businessStatsQuoteAsset: vuexTypes.businessStatsQuoteAsset,
      accountId: vuexTypes.accountId,
    }),
  },

  async created () {
    await this.loadAssets()
    this.defaultQuoteAsset = this.businessStatsQuoteAsset
    this.isLoaded = true
  },

  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
      loadBusinessStatsQuoteAsset: vuexTypes.LOAD_BUSINESS_STATS_QUOTE_ASSET,
    }),

    async setDefaultQuoteAsset () {
      if (this.isDefaultQuoteAssetChanged()) return
      const endpoint = `/integrations/dns/businesses/${this.accountId}/settings/quote-asset`
      try {
        await api.postWithSignature(endpoint, {
          data: {
            type: 'stats-quote-asset',
            attributes: {
              quote_asset: this.defaultQuoteAsset,
            },
          },
        })
        Bus.success('default-quote-asset-select-field.set-asset-msg')
        await this.loadBusinessStatsQuoteAsset()
      } catch (error) {
        ErrorHandler.process(error)
      }
    },

    isDefaultQuoteAssetChanged () {
      return this.businessStatsQuoteAsset === this.defaultQuoteAsset
    },
  },
}
</script>
