<template>
  <form
    class="step"
    @submit.prevent="submit">
    <div class="app__form-row">
      <input-field-unchained
        v-model="form.name"
        v-validate="'required'"
        class="app__form-field"
        name="sale-name"
        id="sale-name"
        :label="i18n.lbl_sale_name()"
        :error-message="errorMessage('sale-name')"
      />
      <select-field-unchained
        name="sale-base-asset"
        id="sale-base-asset"
        class="app__form-field"
        v-model="form.baseAsset"
        :values="values.tokens"
        :label="i18n.lbl_base_asset()" />
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <!-- hack with key is necessary for correct rendering when
             disableAfter and disableBefore is changed -->
        <date-field-flatpickr
          v-model="form.startTime"
          name="sale-start-time"
          id="sale-start-time"
          :key="`sale-creation-general-info-${form.endTime}`"
          :label="i18n.sale_start_time()"
          :disable-before="yesterday"
          :disable-after="form.endTime"
          v-validate="'required'"
          :error-message="errorMessage('sale-open-time')" />
      </div>
      <div class="app__form-field">
        <!-- hack with key is necessary for correct rendering when
             disableAfter and disableBefore is changed -->
        <date-field-flatpickr
          v-model="form.endTime"
          name="sale-close-time"
          id="sale-close-time"
          :key="`sale-creation-general-info-${form.startTime}`"
          :label="i18n.sale_close_time()"
          :disable-before="form.startTime || yesterday"
          v-validate="'required'"
          :error-message="errorMessage('sale-close-time')" />
      </div>
    </div>
    <div class="app__form-row">
      <input-field-unchained
        v-model="form.softCap"
        v-validate="{
          required:true,
          amount: true
        }"
        class="app__form-field"
        name="sale-soft-cap"
        id="sale-soft-cap"
        :label="i18n.sale_soft_cap_with_asset({
          asset: config.DEFAULT_QUOTE_ASSET
        })"
        :error-message="errorMessage('sale-soft-cap')"
      />
      <input-field-unchained
        v-model="form.hardCap"
        v-validate="{
          required:true,
          amount: true,
          soft_cap: [form.softCap]
        }"
        class="app__form-field"
        name="sale-hard-cap"
        id="sale-hard-cap"
        :label="i18n.sale_hard_cap_with_asset({
          asset: config.DEFAULT_QUOTE_ASSET
        })"
        :error-message="errorMessage('sale-hard-cap')"
      />
    </div>
    <div class="app__form-row">
      <input-field-unchained
        v-model="form.baseAssetForHardCap"
        v-validate="{
          required: true,
          amount: true,
          max_issuance: [avalaibleForIssuance, form.baseAsset]
        }"
        class="app__form-field
              md-layout-item
              md-size-31
              md-small-size-95
              md-xsmall-size-100"
        name="sale-base-asset-for-hard-cap"
        id="sale-base-asset-for-hard-cap"
        :label="i18n.sale_base_asset_hard_cap_to_sell({
          asset: form.baseAsset
        })"
        :error-message="errorMessage('sale-base-asset-for-hard-cap')"
      />
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <label class="step__quote-assets-label">
          {{ i18n.sale_quote_assets() }}
        </label>
        <div class="step__quote-assets-checkboxes">
          <tick-field
            class="step__quote-assets-checkbox"
            v-for="(token,i) in walletTokens"
            v-model="form.quoteAssets"
            :cb-value="token.code"
            :key="i">
            {{ token.code }}
          </tick-field>
        </div>
      </div>
    </div>
    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="app__form-submit-btn"
        :disabled="isPending">
        {{ i18n.sale_next_step() }}
      </button>
    </div>
  </form>
</template>

<script>
import StepMixin from './step.mixin'
import { ErrorHandler } from 'L@/js/errors/error_handler'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { commonEvents } from 'L@/js/events/common_events'
import { ASSET_POLICIES, documentTypes } from 'L@/js/const/const'
import { i18n } from 'L@/js/i18n'
import { vuexTypes } from 'L@/vuex/types'
import { mapGetters } from 'vuex'
import _pick from 'lodash/pick'
import config from '@/config'
import moment from 'moment'

export default {
  name: 'step-general-info',
  mixins: [StepMixin],
  data: _ => ({
    values: {
      tokens: []
    },
    form: {
      name: '',
      baseAsset: '',
      startTime: '',
      endTime: '',
      softCap: '',
      hardCap: '',
      baseAssetForHardCap: '',
      quoteAssets: []
    },
    i18n,
    config,
    documentTypes,
    ASSET_POLICIES,
    uploadVideo: false
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountOwnedTokenCodes,
      vuexTypes.walletTokens,
      vuexTypes.userAcquiredTokens
    ]),
    avalaibleForIssuance () {
      const token = this.userAcquiredTokens
        .find(token => token.code === this.form.baseAsset)
      return token.available
    },
    yesterday () {
      return moment().subtract(1, 'd').format()
    }
  },
  created () {
    this.values.tokens = this.accountOwnedTokenCodes
    this.form = _pick(this.sale, Object.keys(this.form))
    if (!this.form.baseAsset) {
      this.setTokenCode()
    }
  },
  methods: {
    setTokenCode () {
      this.form.baseAsset = this.values.tokens[0] || null
    },
    async submit () {
      if (!await this.isValid()) return
      if (!this.form.quoteAssets.length) {
        EventDispatcher.dispatchShowErrorEvent(
          i18n.sale_accept_investments()
        )
        return
      }
      this.disable()
      try {
        this.$emit(commonEvents.saleUpdateEvent, {
          form: this.form
        })
      } catch (error) {
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    }
  }
}
</script>

<style scoped lang="scss">
  @import 'step';
  @import "~L@scss/variables";

  .app__form-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .step__quote-assets-label {
    font-weight: bold;
    font-size: 1.4 * $point;
    color: $col-fund-card-text;
  }

  .step__quote-assets-checkboxes {
    display: flex;
    flex-direction: column;
    margin-top: 1 * $point;
  }
  .step__quote-assets-checkbox {
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
</style>
