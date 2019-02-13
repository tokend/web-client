<template>
  <div class="sale-campaign">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isInvestDrawerShown">
        <template slot="heading">
          {{ 'sale-details.invest' | globalize }}
        </template>

        <invest-form
          :sale="sale"
          @submitted="$emit(EVENTS.updateAsk)"
          @canceled="$emit(EVENTS.updateAsk)"
        />
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
            <!-- eslint-disable-next-line max-len -->
            {{ { value: sale.currentCap, currency: sale.defaultQuoteAsset } | formatMoney }}
          </p>

          <p class="sale-campaign__funded">
            <!-- eslint-disable-next-line max-len -->
            {{ 'sale-details.funded' | globalize({ funded: sale.currentCap / sale.hardCap }) }}
          </p>

          <div class="sale-campaign__progress-bar">
            <div
              class="sale-campaign__progress"
              :style="`width: ${sale.hardCapProgress}%`"
            />
          </div>

          <vue-markdown
            class="sale-campaign__investors"
            :source="'sale-details.investors' | globalize({
              investors: sale.investors
            })"
            :html="false"
          />

          <vue-markdown
            class="sale-campaign__days-to-go"
            :source="'sale-details.days-to-go' | globalize({
              days: sale.daysToGo
            })"
            :html="false"
          />

          <div class="sale-campaign__actions">
            <button
              v-ripple
              class="app__button-raised sale-campaign__invest-btn"
              @click="isInvestDrawerShown = true"
            >
              {{ 'sale-details.invest' | globalize }}
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

const EVENTS = {
  updateAsk: 'update-ask',
}

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
    EVENTS,
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
  flex-basis: 64%;
  background-color: $col-sale-details-block;
  border-radius: .4rem;
  margin: 1.6rem;

  @include respond-to($x-medium) {
    flex-basis: 55%;
  }
}

.sale-campaign__sale-logo-wrp {
  background-color: $col-sale-details-logo-bg;
  position: relative;
  height: 36rem;
  width: 100%;

  @include respond-to($x-medium) {
    height: 24rem;
  }
}

.sale-campaign__sale-logo {
  position: absolute;
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
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
  flex-basis: 36%;
  background-color: $col-sale-details-block;
  border-radius: .4rem;
  margin: 1.6rem;
  padding: 3.3rem 3.4rem 2.2rem 2.4rem;

  @include respond-to($x-medium) {
    flex-basis: 45%;
  }
}

.sale-campaign__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: .3rem;
  background-color: $col-sale-details-progress-bar-bg;

  .sale-campaign__progress {
    background: $col-sale-details-progress-bar-funded;
    height: 100%;
  }
}

.sale-campaign__invested {
  font-size: 2.4rem;
  color: $col-sale-details-text-primary;
}

.sale-campaign__funded {
  font-size: 1.4rem;
  color: $col-sale-details-text-secondary;
}

.sale-campaign__investors, .sale-campaign__days-to-go {
  h3 {
    font-size: 2.4rem;
    font-weight: normal;
    color: $col-sale-details-text-primary;
  }

  p {
    font-size: 1.4rem;
    color: $col-sale-details-text-secondary;
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
  margin: .5rem;
}
</style>
