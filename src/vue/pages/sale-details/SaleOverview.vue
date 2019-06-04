<template>
  <div class="sale-overview">
    <template v-if="isLoaded">
      <div class="sale-overview__asset">
        <h3 class="sale-overview__asset-title">
          {{ 'sale-overview.asset-title' | globalize }}
        </h3>

        <asset-details
          :asset="asset"
          :show-actions="false"
        />
      </div>

      <div class="sale-overview__details">
        <h3 class="sale-overview__details-title">
          {{ 'sale-overview.details-title' | globalize }}
        </h3>

        <sale-overview-details :sale="sale" />
      </div>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader :message-id="'sale-overview.loading-msg'" />
    </template>

    <template v-else>
      <p>
        {{ 'sale-overview.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import AssetDetails from '@/vue/pages/assets/AssetDetails'
import Loader from '@/vue/common/Loader'

import SaleOverviewDetails from './SaleOverviewDetails'

import config from '@/config'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'sale-overview',
  components: {
    AssetDetails,
    Loader,
    SaleOverviewDetails,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    config,
    isLoaded: false,
    isLoadingFailed: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.assets,
    ]),
    asset () {
      return this.assets.find(item => item.code === this.sale.baseAsset) || {}
    },
  },
  async created () {
    try {
      await this.loadAssets()
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },
  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.sale-overview__asset-title {
  margin-bottom: 2rem;
}

.sale-overview__details {
  margin-top: 3.2rem;
}

.sale-overview__details-title {
  margin-bottom: 2rem;
}
</style>
