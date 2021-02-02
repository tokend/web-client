<template>
  <div class="sale-description-viewer">
    <template v-if="isLoaded">
      <template v-if="saleDescription">
        <vue-markdown
          class="sale-description-viewer__markdown"
          :source="saleDescription"
        />
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

import { api } from '@/api'

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
    saleDescription: 'Linde is a leading global industrial gases and engineering company with 2019 sales of $28 billion (€25 billion), and is actively looking for expansion of its industry-leading plants  for the supply of nitrogen, oxygen and compressed air to clients to meet the increasing demand in industrial gases. Linde constructs the plants and hands them over completed to clients. ',
    isLoaded: false,
    isLoadingFailed: false,
  }),

  async created () {
    // await this.loadSaleDescription()
  },

  methods: {
    async loadSaleDescription () {
      try {
        const accountId = this.sale.owner
        const blobId = this.sale.description

        const endpoint = `/accounts/${accountId}/blobs/${blobId}`
        const { data: blob } = await api.getWithSignature(endpoint)

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

<style lang="scss">
@import '~@scss/variables';

.sale-description-viewer {
  padding: 3.2rem;
  color: $col-text;
}

.sale-description-viewer__no-data {
  text-align: center;
  font-weight: 700;
  font-size: 1.6rem;
}

/* stylelint-disable selector-nested-pattern */
.sale-description-viewer__markdown {
  word-break: break-all;

  img {
    max-width: 100%;
    margin: 0.8rem 0;
  }

  h1 {
    font-size: 2.8rem;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }

  h2 {
    font-size: 2.2rem;
    margin-bottom: 1.4rem;
    margin-top: 1.4rem;
  }

  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  p {
    margin-bottom: 0.8rem;
  }

  ul {
    // stylelint-disable-next-line
    list-style-type: disc !important;
    padding-left: 1.6rem;
  }

  li {
    // stylelint-disable-next-line
    list-style-type: disc !important;
    margin-bottom: 0.8rem;
  }

  a {
    color: $col-secondary;
  }
}
</style>
