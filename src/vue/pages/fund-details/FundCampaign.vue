<template>
  <div class="fund-campaign">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isInvestDrawerShown">
        <template slot="heading">
          {{ 'fund-details.invest-title' | globalize }}
        </template>

        <invest-form :fund="fund" />
      </drawer>

      <div class="fund-campaign__content">
        <div class="fund-campaign__overview">
          <div class="fund-campaign__fund-logo-wrp">
            <img
              class="fund-campaign__fund-logo"
              :src="fund.logoUrl(config.FILE_STORAGE)"
            >
          </div>
          <template v-if="fundDescription">
            <vue-markdown
              class="fund-campaign__fund-description"
              :source="fundDescription"
              :html="false"
            />
          </template>

          <template v-else>
            <p class="fund-campaign__no-description">
              {{ 'fund-details.no-description-msg' | globalize }}
            </p>
          </template>
        </div>

        <div class="fund-campaign__investment">
          <chart
            class="fund-campaign__marketprice"
            :base-asset="fund.baseAsset"
            :quote-asset="fund.defaultQuoteAsset"
            :is-tabs-shown="false"
            :is-ticks-shown="false"
          />

          <p class="fund-campaign__invested">
            <!-- eslint-disable max-len -->
            {{ { value: fund.currentCap, currency: fund.defaultQuoteAsset } | formatMoney }}
            <!-- eslint-enable max-len -->
          </p>

          <p class="fund-campaign__funded">
            <!-- eslint-disable max-len -->
            {{ 'fund-details.funded' | globalize({ funded: fund.currentCap / fund.hardCap }) }}
            <!-- eslint-enable max-len -->
          </p>

          <div class="fund-campaign__progress-bar">
            <div
              class="fund-campaign__progress"
              :style="`width: ${capProgress}%`"
            />
          </div>

          <!-- eslint-disable max-len -->
          <vue-markdown
            class="fund-campaign__investors"
            :source="'fund-details.investors' | globalize({ investors: fund.investors })"
            :html="false"
          />
          <!-- eslint-enable max-len -->

          <!-- eslint-disable max-len -->
          <vue-markdown
            class="fund-campaign__days-to-go"
            :source="'fund-details.days-to-go' | globalize({ days: fund.daysToGo })"
            :html="false"
          />
          <!-- eslint-enable max-len -->

          <button
            v-ripple
            class="app__button-raised fund-campaign__invest-btn"
            @click="isInvestDrawerShown = true"
          >
            {{ 'fund-details.invest-title' | globalize }}
          </button>
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
import Drawer from '@/vue/common/Drawer'
import Chart from '@/vue/common/chart/Chart'
import InvestForm from '@/vue/forms/InvestForm'

import VueMarkdown from 'vue-markdown'

import { Sdk } from '@/sdk'
import config from '@/config'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'fund-campaign',
  components: {
    Loader,
    Drawer,
    VueMarkdown,
    Chart,
    InvestForm,
  },

  data: _ => ({
    fund: {},
    fundDescription: '',
    isLoaded: false,
    isLoadingFailed: false,
    isInvestDrawerShown: false,
    config,
  }),

  computed: {
    capProgress () {
      const capPercentage = (this.fund.currentCap / this.fund.hardCap) * 100
      const progress = Math.round(capPercentage * 100) / 100

      return progress >= 100 ? 100 : progress
    },
  },

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

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.fund-campaign__content {
  display: flex;
  align-items: flex-start;
  margin: .8rem -1.6rem -1.6rem;

  @include respond-to($small) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}

.fund-campaign__overview {
  flex: 0 1 62.5%;
  background-color: #fff;
  border-radius: .4rem;
  margin: 1.6rem;

  @include respond-to($x-medium) {
    flex-basis: 55%;
  }
}

.fund-campaign__fund-logo-wrp {
  background-color: #ccc;
  position: relative;
  height: 36rem;
  width: 100%;

  @include respond-to($x-medium) {
    height: 24rem;
  }
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

.fund-campaign__no-description {
  padding: 2rem 0;
  text-align: center;
  font-weight: bold;
  font-size: 1.6rem;
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

  @include respond-to($x-medium) {
    flex: 0 1 45%;
  }
}

.fund-campaign__marketprice {
  height: 25rem;
}

.fund-campaign__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: .3rem;
  background-color: #c1bfd0;

  .fund-campaign__progress {
    background: #7b6eff;
    height: 100%;
  }
}

.fund-campaign__invested {
  font-size: 2.4rem;
  color: #3a4180;
}

.fund-campaign__funded {
  font-size: 1.4rem;
  color: #837fa1;
}

.fund-campaign__investors, .fund-campaign__days-to-go {
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

.fund-campaign__investors {
  margin-top: 2.4rem;
}

.fund-campaign__days-to-go {
  margin-top: 1.6rem;
}

.fund-campaign__invest-btn {
  margin-top: 2.4rem;
  max-width: 18rem;
  width: 100%;
}
</style>
