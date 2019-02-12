<template>
  <div class="sale-campaign">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isInvestDrawerShown">
        <template slot="heading">
          {{ 'sale-details.invest-title' | globalize }}
        </template>

        <invest-form :sale="sale" />
      </drawer>

      <drawer :is-shown.sync="isOverviewDrawerShown">
        <template slot="heading">
          {{ 'sale-details.overview-title' | globalize }}
        </template>

        <sale-overview :sale="sale" />
      </drawer>

      <div class="sale-campaign__content">
        <div class="sale-campaign__overview">
          <div class="sale-campaign__sale-logo-wrp">
            <img
              class="sale-campaign__sale-logo"
              :src="sale.logoUrl(config.FILE_STORAGE)"
            >
          </div>
          <template v-if="saleDescription">
            <vue-markdown
              class="sale-campaign__sale-description"
              :source="saleDescription"
              :html="false"
            />
          </template>

          <template v-else>
            <p class="sale-campaign__no-description">
              {{ 'sale-details.no-description-msg' | globalize }}
            </p>
          </template>
        </div>

        <div class="sale-campaign__investment">
          <chart
            class="sale-campaign__marketprice"
            :base-asset="sale.baseAsset"
            :quote-asset="sale.defaultQuoteAsset"
            :is-tabs-shown="false"
            :is-ticks-shown="false"
          />

          <p class="sale-campaign__invested">
            <!-- eslint-disable max-len -->
            {{ { value: sale.currentCap, currency: sale.defaultQuoteAsset } | formatMoney }}
            <!-- eslint-enable max-len -->
          </p>

          <p class="sale-campaign__funded">
            <!-- eslint-disable max-len -->
            {{ 'sale-details.funded' | globalize({ funded: sale.currentCap / sale.hardCap }) }}
            <!-- eslint-enable max-len -->
          </p>

          <div class="sale-campaign__progress-bar">
            <div
              class="sale-campaign__progress"
              :style="`width: ${capProgress}%`"
            />
          </div>

          <!-- eslint-disable max-len -->
          <vue-markdown
            class="sale-campaign__investors"
            :source="'sale-details.investors' | globalize({ investors: sale.investors })"
            :html="false"
          />
          <!-- eslint-enable max-len -->

          <!-- eslint-disable max-len -->
          <vue-markdown
            class="sale-campaign__days-to-go"
            :source="'sale-details.days-to-go' | globalize({ days: sale.daysToGo })"
            :html="false"
          />
          <!-- eslint-enable max-len -->

          <div class="sale-campaign__actions">
            <button
              v-ripple
              class="app__button-raised sale-campaign__invest-btn"
              @click="isInvestDrawerShown = true"
            >
              {{ 'sale-details.invest-title' | globalize }}
            </button>

            <button
              v-ripple
              class="app__button sale-campaign__overview-btn"
              @click="isOverviewDrawerShown = true"
            >
              {{ 'sale-details.view-details-btn' | globalize }}
            </button>
          </div>
        </div>
      </div>
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
import Drawer from '@/vue/common/Drawer'
import Chart from '@/vue/common/chart/Chart'
import InvestForm from '@/vue/forms/InvestForm'
import SaleOverview from '@/vue/pages/sale-details/SaleOverview'

import VueMarkdown from 'vue-markdown'

import { Sdk } from '@/sdk'
import config from '@/config'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'sale-campaign',
  components: {
    Loader,
    Drawer,
    VueMarkdown,
    Chart,
    InvestForm,
    SaleOverview,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    saleDescription: '',
    isLoaded: false,
    isLoadingFailed: false,
    isInvestDrawerShown: false,
    isOverviewDrawerShown: false,
    config,
  }),

  computed: {
    capProgress () {
      const capPercentage = (this.sale.currentCap / this.sale.hardCap) * 100
      const progress = Math.round(capPercentage * 100) / 100

      return progress >= 100 ? 100 : progress
    },
  },

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

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.sale-campaign__content {
  display: flex;
  align-items: flex-start;
  margin: .8rem -1.6rem -1.6rem;

  @include respond-to($small) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}

.sale-campaign__overview {
  flex: 0 1 62.5%;
  background-color: #fff;
  border-radius: .4rem;
  margin: 1.6rem;

  @include respond-to($x-medium) {
    flex-basis: 55%;
  }
}

.sale-campaign__sale-logo-wrp {
  background-color: #ccc;
  position: relative;
  height: 36rem;
  width: 100%;

  @include respond-to($x-medium) {
    height: 24rem;
  }
}

.sale-campaign__sale-logo {
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

.sale-campaign__no-description {
  padding: 2rem 0;
  text-align: center;
  font-weight: bold;
  font-size: 1.6rem;
}

.sale-campaign__sale-description {
  padding: 3.2rem;
}

.sale-campaign__investment {
  flex: 0 1 34.4%;
  background-color: #fff;
  border-radius: .4rem;
  margin: 1.6rem;
  padding: 3.3rem 3.4rem 2.2rem 2.4rem;

  @include respond-to($x-medium) {
    flex: 0 1 45%;
  }
}

.sale-campaign__marketprice {
  height: 25rem;
}

.sale-campaign__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: .3rem;
  background-color: #c1bfd0;

  .sale-campaign__progress {
    background: #7b6eff;
    height: 100%;
  }
}

.sale-campaign__invested {
  font-size: 2.4rem;
  color: #3a4180;
}

.sale-campaign__funded {
  font-size: 1.4rem;
  color: #837fa1;
}

.sale-campaign__investors, .sale-campaign__days-to-go {
  h3 {
    font-size: 2.4rem;
    font-weight: normal;
    color: #3a4180;
  }

  p {
    font-size: 1.4rem;
    color: #837fa1;
  }
}

.sale-campaign__investors {
  margin-top: 2.4rem;
}

.sale-campaign__days-to-go {
  margin-top: 1.6rem;
}

.sale-campaign__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 1.9rem -.5rem -.5rem;
}

.sale-campaign__invest-btn {
  margin: .5rem;
  max-width: 12rem;
  width: 100%;
}

.sale-campaign__overview-btn {
  padding: 0;
  font-weight: normal;
  max-width: 13rem;
  margin: .5rem;
}
</style>
