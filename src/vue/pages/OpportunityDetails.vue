<template>
  <div class="opportunity-details">
    <template v-if="opportunity">
      <top-bar>
        <template slot="main">
          <!--
            HACK: we don't need any active-class here, so empty "active-class"
            attr prevents adding any active-class
           -->
          <router-link :to="{ ...vueRoutes.sales }" active-class>
            <span>
              {{ 'opportunity-details.opportunities-list' | globalize }}
            </span>
          </router-link>

          <router-link
            :to="{ ...vueRoutes.saleCampaign, params: { id: id } }"
          >
            <span>
              {{ 'opportunity-details.campaign-title' | globalize }}
            </span>
          </router-link>
        </template>

        <template slot="extra">
          <template v-if="isOpportunityOwner && token">
            <template v-if="token.details.subtype === ASSET_SUBTYPE.bond">
              <button
                v-ripple
                :disabled="!isOpportunityClosed"
                class="app__button-raised opportunity-details__invest-btn"
                @click="isBuyBackDrawerShown = true"
              >
                {{ 'opportunity-details.buy-back' | globalize }}
              </button>
            </template>
            <template v-else-if="token.details.subtype === ASSET_SUBTYPE.share">
              <button
                v-ripple
                :disabled="!isOpportunityClosed"
                class="app__button-raised opportunity-details__invest-btn"
                @click="isDividendDrawerShown = true"
              >
                {{ 'opportunity-details.dividend' | globalize }}
              </button>
            </template>
          </template>
          <template v-else>
            <button
              v-ripple
              class="app__button-raised opportunity-details__invest-btn"
              @click="isInvestDrawerShown = true"
            >
              {{ 'opportunity-details.invest' | globalize }}
            </button>
          </template>
        </template>
      </top-bar>

      <drawer :is-shown.sync="isInvestDrawerShown">
        <template slot="heading">
          {{ 'opportunity-details.invest' | globalize }}
        </template>

        <invest-form
          :sale="opportunity"
          @submitted="hideInvestDrawer() || refreshOpportunity()"
          @canceled="hideInvestDrawer() || refreshOpportunity()"
        />
      </drawer>

      <template v-if="getModule().canRenderSubmodule(DividendFormModule)">
        <drawer :is-shown.sync="isDividendDrawerShown">
          <template slot="heading">
            {{ 'opportunity-details.dividend-form-title' | globalize }}
          </template>
          <submodule-importer
            :submodule="getModule().getSubmodule(DividendFormModule)"
            :wallet="wallet"
            :config="dividendConfig"
            @transferred="dividendModuleTransferred"
          />
        </drawer>
      </template>

      <template v-if="getModule().canRenderSubmodule(BuyBackFormModule)">
        <drawer :is-shown.sync="isBuyBackDrawerShown">
          <template slot="heading">
            {{ 'opportunity-details.buy-back-form-title' | globalize }}
          </template>
          <submodule-importer
            :submodule="getModule().getSubmodule(BuyBackFormModule)"
            :wallet="wallet"
            :config="buyBackConfig"
            @submitted="buyBackModuleSubmitted"
          />
        </drawer>
      </template>

      <div class="opportunity-details__title">
        <h2 class="opportunity-details__name">
          {{ `${opportunity.name} (${opportunity.baseAsset})` }}
        </h2>

        <p class="opportunity-details__short-desc">
          {{ opportunity.shortDescription }}
        </p>
      </div>

      <router-view :sale="opportunity" />
    </template>

    <template v-else-if="isOpportunityNotFound">
      <no-data-message
        icon-name="alert-circle"
        :title="'opportunity-details.opportunity-not-found-title' | globalize"
        :message="'opportunity-details.opportunity-not-found-desc' | globalize"
      />
    </template>

    <template v-else-if="isLoadingFailed">
      <p>
        {{ 'opportunity-details.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <loader message-id="opportunity-details.loading-msg" />
    </template>
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import NoDataMessage from '@/vue/common/NoDataMessage'

import InvestForm from '@/vue/forms/InvestForm'
import { DividendFormModule } from '@/vue/modules/dividend-form/module'
import { BuyBackFormModule } from '@/vue/modules/buy-back-form/module'

import SubmoduleImporter from '@/modules-arch/submodule-importer'

import { SaleRecord } from '@/js/records/entities/sale.record'
import { AssetRecord } from '@/js/records/entities/asset.record'
import { ASSET_SUBTYPE } from '@/js/const/asset-subtypes.const'

import { Sdk } from '@/sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@/js/errors'

import { vueRoutes } from '@/vue-router/routes'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import config from '@/config'

export default {
  name: 'opportunity-details',
  components: {
    TopBar,
    Loader,
    Drawer,
    NoDataMessage,
    InvestForm,
    SubmoduleImporter,
  },

  props: {
    id: { type: String, default: '' },
  },

  data: _ => ({
    opportunity: null,
    token: null,
    isOpportunityNotFound: false,
    isLoadingFailed: false,
    isDividendDrawerShown: false,
    isBuyBackDrawerShown: false,
    isInvestDrawerShown: false,
    vueRoutes,
    ASSET_SUBTYPE,
    DividendFormModule,
    BuyBackFormModule,
    dividendConfig: {
      decimalPoints: config.DECIMAL_POINTS,
      horizonURL: config.HORIZON_SERVER,
      minAmount: config.MIN_AMOUNT,
      defaultAssetCode: null,
    },
    buyBackConfig: {
      decimalPoints: config.DECIMAL_POINTS,
      horizonURL: config.HORIZON_SERVER,
      minAmount: config.MIN_AMOUNT,
      defaultAssetCode: null,
    },
  }),

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
      accountId: vuexTypes.accountId,
    }),
    isOpportunityOwner () {
      return this.opportunity.owner === this.accountId
    },
    isOpportunityClosed () {
      return this.opportunity.isClosed
    },
  },

  async created () {
    await this.loadOpportunity(this.id)
    await this.loadToken(this.opportunity.baseAsset)
    this.setDefaultDividendAssetCode()
    this.setDefaultBuyBackAssetCode()
  },

  methods: {
    async loadOpportunity (opportunityId) {
      try {
        const { data } = await Sdk.horizon.sales.get(opportunityId)
        this.opportunity = new SaleRecord(data)
      } catch (e) {
        if (e instanceof errors.NotFoundError) {
          this.isOpportunityNotFound = true
        } else {
          this.isLoadingFailed = true
          ErrorHandler.processWithoutFeedback(e)
        }
      }
    },

    async loadToken (assetCode) {
      try {
        const { data } = await Sdk.horizon.assets.get(assetCode)
        this.token = new AssetRecord(data)
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async refreshOpportunity () {
      this.opportunity = null
      await this.loadOpportunity(this.id)
    },

    setDefaultDividendAssetCode () {
      this.dividendConfig.defaultAssetCode = this.opportunity.baseAsset
    },

    setDefaultBuyBackAssetCode () {
      this.buyBackConfig.defaultAssetCode = this.opportunity.baseAsset
    },

    dividendModuleTransferred () {
      this.isDividendDrawerShown = false
    },

    buyBackModuleSubmitted () {
      this.isBuyBackDrawerShown = false
    },

    hideInvestDrawer () {
      this.isInvestDrawerShown = false
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";

.opportunity-details__name {
  font-size: 3rem;
  font-weight: normal;
  color: $col-sale-details-title;
}

.opportunity-details__short-desc {
  margin-top: .4rem;
  font-size: 1.6rem;
  color: $col-sale-details-subtitle;
}
</style>
