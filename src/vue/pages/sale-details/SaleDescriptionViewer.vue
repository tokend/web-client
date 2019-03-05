<template>
  <div class="sale-description-viewer">
    <template v-if="isLoaded">
      <template v-if="saleDescription">
        <vue-markdown :source="saleDescription" />
      </template>

      <template v-else>
        <p class="sale-description-viewer__no-data">
          {{ 'sale-details.no-description-msg' | globalize }}
        </p>
      </template>
    </template>

    <template v-else-if="isLoadingFailed">
      <p>
        {{ 'sale-details.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <loader :message-id="'sale-details.loading-msg'" />
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import VueMarkdown from 'vue-markdown'

import { Sdk } from '@/sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'sale-description-viewer',
  components: {
    Loader,
    VueMarkdown,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    saleDescription: '',
    isLoaded: false,
    isLoadingFailed: false,
  }),

  async created () {
    await this.loadSaleDescription()
  },

  methods: {
    async loadSaleDescription () {
      try {
        const { data: blob } =
          await Sdk.api.blobs.get(this.sale.description, this.sale.owner)
        this.saleDescription = JSON.parse(blob.value)
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
.sale-description-viewer {
  padding: 3.2rem;
}

.sale-description-viewer__no-data {
  text-align: center;
  font-weight: bold;
  font-size: 1.6rem;
}
</style>
