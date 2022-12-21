<template>
  <div class="sale-statistics-viewer">
    <template v-if="isLoaded">
      <template v-if="investments.length">
        <h3>{{ 'sale-statistics.participation-title' | globalize }}</h3>
        <div class="app__table">
          <table>
            <thead>
              <th>{{ 'sale-statistics.participant-th' | globalize }}</th>
              <th>{{ 'sale-statistics.investment-th' | globalize }}</th>
            </thead>
            <tbody>
              <tr
                v-for="investment in investments"
                :key="investment.id"
              >
                <td>
                  <email-getter :account-id="investment.participant.id" />
                </td>
                <td>
                  {{
                    formatMoney({
                      value: investment.amount,
                      currency: investment.quoteAsset.id
                    })
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <no-data-message
        v-else
        icon-name="trending-up"
        :title="'sale-statistics.no-investments-title' | globalize"
        :message="'sale-statistics.no-investments-msg' | globalize"
      />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="sale-statistics-viewer-msg">
        {{ 'sale-statistics.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="sale-statistics.loading-msg" />
    </template>

    <div class="sale-statistics-viewer__collection-loader-wrp">
      <collection-loader
        v-show="isLoaded && investments.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setInvestments"
        @next-page-load="concatInvestments"
      />
    </div>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { SaleRecord } from '@/js/records/entities/sale.record'
import { formatMoney } from '@/js/helpers/money-helper'

export default {
  name: 'sale-statictics-viewer',
  components: {
    EmailGetter,
    LoadSpinner,
    NoDataMessage,
    CollectionLoader,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    investments: [],
    firstPageLoader: _ => {},
  }),

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadSaleParticipants()
    },

    async loadSaleParticipants () {
      this.isLoaded = false
      try {
        const endpoint = `/v3/sales/${this.sale.id}/relationships/participation`
        const response = await api.getWithSignature(endpoint)
        this.isLoaded = true

        return response
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback()
      }
    },

    setInvestments (investments) {
      this.investments = investments
    },

    concatInvestments (investments) {
      this.investments = this.investments.concat(investments)
    },
  },
  setup () {
    return {
      formatMoney,
    }
  },
}
</script>
