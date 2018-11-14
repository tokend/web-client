<template>
  <div class="create-sale">
    <div>
      <template v-if="!isReady">
        <loader :message="i18n.sale_create_loading()" />
      </template>
      <template v-else-if=" accountTypeI !== ACCOUNT_TYPES.syndicate">
        <not-available-card
          icon="work"
          :title="i18n.lbl_not_available()"
          :descr="i18n.sale_not_available_exp()" />
      </template>
      <template v-else-if="!accountOwnedTokenCodes.length">
        <not-available-card
          icon="work"
          :title="i18n.lbl_not_available()"
          :descr="i18n.lbl_token_not_available_yet()" />
      </template>
      <template v-else-if="view.mode === VIEW_MODES.edit">
        <md-steppers
          class="create-sale__steppers"
          md-vertical
          md-linear
          :md-active-step.sync="activeStep">
          <md-step
            v-for="(step, i) in steps"
            :key="i"
            :id="step.name"
            :md-label="step.label"
            :md-done.sync="step.done"
          >
            <component
              :is="step.component"
              :schema="step.schema"
              :sale="sale"
              @sale-update="handleSaleUpdate($event, { step, i })"
              @sale-edit-end="handleSaleEditEnd"
            />
          </md-step>
        </md-steppers>
      </template>

      <template v-else-if="view.mode === VIEW_MODES.list">
        <div class="app__page-content-wrp">
          <div class="sale-creation__actions">
            <button
              v-ripple
              @click="startNewSale"
              class="app__button-raised">
              {{ i18n.sale_start_new_sale() }}
            </button>
          </div>

          <div class="sale-creation__request-list-wrp">
            <h4 class="app__page-heading sale-creation__request-list-heading">
              {{ i18n.sale_request_list() }}
            </h4>

            <request-list
              :list="listManager.list"
              @sale-select="handleSaleSelect" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import FormMixin from 'L@/vue/common/mixins/form.mixin'
import RequestList from './SaleCreation.RequestList'
import NotAvailableCard from '../common/NotAvailableCard'
import Loader from 'L@/vue/app/common/Loader'
import steps from './specs/steps.schema'
import config from '@/config'
import { i18n } from 'L@/js/i18n'
import { SaleRequestRecord } from 'L@/js/records/sale_request.record'
import { SaleListManager } from './specs/sale-list-manager'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
import { salesService } from 'L@/js/services/sales.service'
import { DateHelper } from 'L@/js/helpers/date.helper'
import { ErrorHandler } from 'L@/js/errors/error_handler'
import { ACCOUNT_TYPES } from 'L@/js/const/const'
import { confirmAction } from 'L@/js/modals/confirmation_message'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import {
  reviewableRequestsService
} from 'L@/js/services/reviewable_requests.service'
import _get from 'lodash/get'

const VIEW_MODES = {
  list: 'list',
  edit: 'edit',
  confirm: 'confirm'
}

export default {
  name: 'create-sale-index',
  components: {
    RequestList,
    NotAvailableCard,
    Loader
  },
  mixins: [FormMixin],
  props: {
    id: { type: String, default: '' }
  },
  data: _ => ({
    activeStep: steps[0].name,
    sale: null,
    saleRequest: null,
    listManager: new SaleListManager(),
    i18n,
    steps,
    isReady: false,
    view: {
      mode: null
    },
    VIEW_MODES,
    ACCOUNT_TYPES
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.accountTypeI,
      vuexTypes.accountOwnedTokenCodes
    ])
  },
  async created () {
    await Promise.all([
      this.loadTokens(),
      this.loadBalances(),
      this.listManager.fetch()
    ])
    this.isReady = true
    if (this.id) {
      this.saleRequest =
        await reviewableRequestsService.loadReviewableRequestById(this.id)
    }
    if (!this.id && this.listManager.list.length) {
      this.view.mode = VIEW_MODES.list
      return
    }
    this.startNewSale()
  },
  methods: {
    ...mapActions({
      loadTokens: vuexTypes.GET_ALL_TOKENS,
      loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
    }),
    startNewSale () {
      const sale = new SaleRequestRecord(this.saleRequest || undefined)
      this.sale = sale
      this.listManager.add(sale)
      this.view.mode = VIEW_MODES.edit
    },
    handleSaleSelect (sale) {
      this.sale = sale
      this.view.mode = VIEW_MODES.edit
    },
    handleSaleUpdate ({ form, documents }, { step, i }) {
      form = form || {}
      documents = documents || {}
      Object.entries(form).forEach(([key, value]) => {
        this.sale[key] = value
      })
      Object.entries(documents).forEach(([key, value]) => {
        this.sale.logo = value
      })
      this.listManager.pushToStorage()
      if (this.activeStep === steps[steps.length - 1].name) {
        return
      }
      step.done = true
      this.activeStep = (steps[i + 1] || steps[0]).name
    },
    async handleSaleEditEnd () {
      if (!await confirmAction()) return
      await this.listManager.fetch()
      const opts = _get(this.sale.getDetailsForSave(), 'details.sale')
      this.disable()
      try {
        await salesService.createSaleCreationRequest({
          requestID: opts.request_id,
          baseAsset: opts.base_asset,
          defaultQuoteAsset: config.DEFAULT_QUOTE_ASSET,
          startTime: DateHelper.toTimestamp(opts.start_time),
          endTime: DateHelper.toTimestamp(opts.end_time),
          softCap: opts.soft_cap,
          hardCap: opts.hard_cap,
          details: {
            name: opts.details.name,
            short_description: opts.details.short_description,
            description: opts.details.description,
            logo: opts.details.logo,
            youtube_video_id: opts.details.youtube_video_id
          },
          baseAssetForHardCap: opts.base_asset_for_hard_cap,
          quoteAssets: opts.quote_assets,
          isCrowdfunding: true
        })
        this.listManager.drop(this.sale)
        await this.listManager.fetch()
        this.view.mode = VIEW_MODES.list
        this.$router.push({ path: '/requests', hash: '#sale-creation' })
        EventDispatcher.dispatchShowSuccessEvent(
          i18n.sale_create_request_success()
        )
      } catch (error) {
        console.error(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    }
  }
}
</script>

<style lang="scss">
@import "~L@scss/variables";

.create-sale__steppers.md-steppers.md-theme-default {
  margin-left: -10px;
  max-width: 560px;
  background-color: transparent;

  .md-stepper-content.md-active {
    padding-top: 20px;
    padding-left: 80px;
  }
}

.sale-creation__request-list-heading {
  margin: 0 0 -.5 * $point 0 !important;
}

.sale-creation__request-list-wrp {
  margin-top: 4.5 * $point;
}
</style>
