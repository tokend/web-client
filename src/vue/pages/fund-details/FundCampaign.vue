<template>
  <div class="fund-campaign">
    <template v-if="isLoaded">
      <div class="fund-campaign__content">
        <div class="fund-campaign__overview">
          <div class="fund-campaign__fund-logo-wrp">
            <img
              class="fund-campaign__fund-logo"
              :src="fund.logoUrl(config.FILE_STORAGE)"
            >
          </div>
          <vue-markdown
            class="fund-campaign__fund-description"
            :source="fundDescription"
            :html="false"
          />
        </div>

        <div class="fund-campaign__investment">
          <chart
            class="fund-campaign__marketprice"
            :base-asset="fund.baseAsset"
            :quote-asset="fund.defaultQuoteAsset"
            :is-tabs-shown="false"
            :is-ticks-shown="false"
          />
        </div>
      </div>
    </template>

    <template v-else-if="isLoadingFailed">
      <p>
        {{ 'fund-details.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <loader :message-id="'fund-details.loading-msg'" />
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import Chart from '@/vue/common/chart/Chart'

import VueMarkdown from 'vue-markdown'

import { Sdk } from '@/sdk'
import config from '@/config'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'fund-campaign',
  components: {
    Loader,
    VueMarkdown,
    Chart,
  },

  data: _ => ({
    fund: {},
    fundDescription: '',
    isLoaded: false,
    isLoadingFailed: false,
    config,
  }),

  async created () {
    await this.loadFund(this.$route.params.id)
  },

  methods: {
    async loadFund (fundId) {
      try {
        const { data: fund } = await Sdk.horizon.sales.get(fundId)
        this.fund = new SaleRecord(fund)

        const { data: blob } =
          await Sdk.api.blobs.get(this.fund.description, this.fund.owner)
        this.fundDescription = JSON.parse(blob.value)
        this.isLoaded = true
      } catch (e) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.fund-campaign__content {
  display: flex;
  margin: -1.6rem;
}

.fund-campaign__overview {
  flex: 0 1 62.5%;
  background-color: #fff;
  border-radius: .4rem;
  margin: 1.6rem;
}

.fund-campaign__fund-logo-wrp {
  background-color: #ccc;
  position: relative;
  height: 36rem;
  width: 100%;
}

.fund-campaign__fund-logo {
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

.fund-campaign__fund-description {
  padding: 3.2rem;
}

.fund-campaign__investment {
  flex: 0 1 34.4%;
  background-color: #fff;
  border-radius: .4rem;
  margin: 1.6rem;
  padding: 3.3rem 3.4rem 2.2rem 2.4rem;
}

.fund-campaign__marketprice {
  height: 15rem;
}
</style>
