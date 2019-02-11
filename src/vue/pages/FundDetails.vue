<template>
  <div class="fund-details">
    <top-bar v-if="fund.id">
      <template slot="main">
        <router-link
          v-ripple
          :to="vueRoutes.fundDetails.campaign"
        >
          <span>{{ 'fund-details.campaign-title' | globalize }}</span>
        </router-link>
      </template>

      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised fund-details__invest-btn"
          @click="isCreateFundDrawerShown = true"
        >
          {{ 'fund-details.invest-title' | globalize }}
        </button>
      </template>
    </top-bar>

    <template v-if="isLoaded">
      <template v-if="fund.id">
        <div class="fund__details__title">
          <h2 class="fund-details__name">
            {{ fund.name }}
          </h2>

          <p class="fund-details__short-desc">
            {{ fund.shortDescription }}
          </p>
        </div>

        <router-view />
      </template>

      <template v-else>
        <no-data-message
          icon-name="alert-circle"
          :title-id="'fund-details.fund-not-found-title'"
          :message-id="'fund-details.fund-not-found-desc'"
        />
      </template>
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
import TopBar from '@/vue/common/TopBar'
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { Sdk } from '@/sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@/js/errors'

import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'fund-details',
  components: {
    TopBar,
    Loader,
    NoDataMessage,
  },

  data: _ => ({
    fund: {},
    isLoaded: false,
    isLoadingFailed: false,
    vueRoutes,
  }),

  async created () {
    await this.loadFund(this.$route.params.id)
  },

  methods: {
    async loadFund (fundId) {
      try {
        const { data } = await Sdk.horizon.sales.get(fundId)
        this.fund = new SaleRecord(data)
        this.isLoaded = true
      } catch (e) {
        if (e instanceof errors.NotFoundError) {
          this.isLoaded = true
        } else {
          this.isLoadingFailed = true
          ErrorHandler.processWithoutFeedback(e)
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";

.fund-details__name {
  font-size: 3.6rem;
  font-weight: normal;
  color: #3a4180;
}

.fund-details__short-desc {
  margin-top: .4rem;
  font-size: 1.6rem;
  color: #837fa1;
}
</style>
