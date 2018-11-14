<template>
  <div class="invest">
    <div class="invest__row">
      <div class="invest__row-unit">
        <select-field-unchained
          :label="i18n.lbl_asset()"
          v-model="form.quoteAsset"
          :values="sale.quoteAssetCodes" />

        <div
          class="invest__input-hint"
          :class="{ 'invest__input-hint--error': limitExceeded }">
          {{ i18n.sale_invest_available() }}
          <span class="invest__available-amount">{{ i18n.c(available) }}</span>
          <span class="invest__available-asset">{{ form.quoteAsset }}</span>
        </div>
      </div>
    </div>
    <div class="invest__row">
      <div class="invest__row-unit">
        <input-field-unchained
          v-model="form.amount"
          id="investment"
          name="investment"
          type="number"
          :disabled="isOwner"
          :error-message="errorMessage('investment')"
          v-validate="'amount'"
          data-vv-validate-on="input"
          :step="config.MINIMAL_NUMBER_INPUT_STEP"
          :label="i18n.sale_invest_asset({ asset: form.quoteAsset })"
        />

        <div class="invest__input-hint">
          {{ i18n.sale_invest_converted() }}
          <span class="invest__available-amount">
            {{ i18n.cc(form.convertedAmount) }}
          </span>
        </div>
      </div>

      <button
        class="app__button-flat invest__max-value-btn"
        @click="form.amount = maxValue"
        :disabled="available === 0">
        <i class="material-icons">publish</i>
      </button>
    </div>

    <div class="invest__actions">
      <div class="invest__submit-btn-ctn">
        <button
          v-ripple
          @click="invest"
          class="app__button-raised invest__submit-btn"
          :disabled="isPending ||
            isOwner ||
            hardCapExceeded ||
            !sale.isOpened ||
            sale.isUpcoming ||
            !form.amount
          ">
          {{ offer ? i18n.sale_update_offer() : i18n.sale_invest() }}
        </button>
        <md-tooltip
          v-if="sale.isUpcoming"
          md-direction="top">
          {{ i18n.sale_disable_invest_upcoming_sale() }}
        </md-tooltip>
        <md-tooltip
          v-else-if="isOwner"
          md-direction="top">
          {{ i18n.sale_disable_invest_owners() }}
        </md-tooltip>
        <md-tooltip
          v-else-if="hardCapExceeded"
          md-direction="top">
          {{
            i18n.sale_disable_invest_hardcap_exceed({
              amount: i18n.cc(sale.hardCap)
            })
          }}
        </md-tooltip>
        <md-tooltip
          v-else-if="sale.isClosed"
          md-direction="top">
          {{ i18n.sale_disable_invest_closed_sale() }}
        </md-tooltip>
        <md-tooltip
          v-else-if="sale.isCanceled"
          md-direction="top">
          {{ i18n.sale_disable_invest_canceled_sale() }}
        </md-tooltip>
      </div>

      <div class="invest__cancel-btn-ctn">
        <hint-wrapper
          :hint="i18n.sale_offer_cancel_tip({
            amount: i18n.c(investedAmount),
            asset: form.quoteAsset
          })"
          :decorated="false">
          <button
            v-ripple
            @click="cancelOffer"
            v-if="sale.isOpened && offer"
            class="app__button-flat invest__cancel-btn"
            :disabled="isPending">
            {{ i18n.sale_offer_cancel() }}
          </button>
        </hint-wrapper>
      </div>
    </div>
  </div>
</template>

<script>
import FormMixin from 'L@/vue/common/mixins/form.mixin'
import { i18n } from 'L@/js/i18n'
import config from '@/config'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
import _get from 'lodash/get'
import { offersService } from 'L@/js/services/offer.service'
import { accountsService } from 'L@/js/services/accounts.service'
import { pairsService } from 'L@/js/services/pairs.service'
import { feeService } from 'L@/js/services/fees.service'
import { ErrorHandler } from 'L@/js/errors/error_handler'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { add, subtract, multiply } from 'L@/js/utils/math.util'
import { RecordFactory } from 'L@/js/records/factory'
import { commonEvents } from 'L@/js/events/common_events'
import InputFieldUnchained from 'L@/vue/common/fields/InputFieldUnchained'
import SelectFieldUnchained from 'L@/vue/common/fields/SelectFieldUnchained'
import HintWrapper from 'L@/vue/common/hint-wrapper/HintWrapper'

export default {
  name: 'sale-invest',
  components: { SelectFieldUnchained, InputFieldUnchained, HintWrapper },
  mixins: [FormMixin],
  props: {
    sale: { type: Object, default: () => {} }
  },
  data: _ => ({
    form: {
      quoteAsset: '',
      amount: 0,
      convertedAmount: 0
    },
    investedAmount: 0,
    offers: [],
    i18n,
    config
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.accountId
    ]),
    offer () {
      return this.offers.find(
        offer => offer.quoteAssetCode === this.form.quoteAsset &&
          offer.baseAssetCode === this.sale.baseAsset) || null
    },
    price () {
      return this.sale.quoteAssetPrices[this.form.quoteAsset] || '1'
    },

    isOwner () {
      return this.sale.owner === this.accountId
    },

    available () {
      const balance = add(
        _get(this.accountBalances, `${this.form.quoteAsset}.balance`, 0),
        _get(this.offer, 'baseAmount', 0))
      const left = balance ? subtract(balance, this.form.amount) : 0
      return left <= 0 ? balance : left
    },
    limitExceeded () {
      if (!this.form.amount) return false
      return this.available <= 0
    },
    hardCapExceeded () {
      return parseFloat(this.form.convertedAmount) >
             parseFloat(add(this.sale.hardCap, 1))
    },
    maxValue () {
      const hardCap = this.sale.hardCaps[this.form.quoteAsset]
      const currentCap = this.sale.totalCurrentCaps[this.form.quoteAsset]
      const lastOfferAmount = this.offer ? this.offer.quoteAmount : 0
      const balance = this.accountBalances[this.form.quoteAsset].balance
      const totalBalance = add(balance, (lastOfferAmount || 0))
      const sub = add(subtract(hardCap, currentCap), lastOfferAmount)
      if (parseFloat(totalBalance) > parseFloat(sub)) {
        return sub
      } else {
        return totalBalance
      }
    }
  },
  watch: {
    'form.amount': async function (value) {
      if (value !== '' && value > 0) {
        this.form.convertedAmount = await pairsService.loadConvertedAmount(
          this.form.amount,
          this.form.quoteAsset,
          this.sale.defaultQuoteAsset
        )
      }
      if (value === '') {
        this.form.convertedAmount = 0
      }
    },
    offer: function (value) {
      if (value) {
        this.form.amount = value.quoteAmount
        this.investedAmount = value.quoteAmount
      } else {
        this.form.amount = ''
        this.form.convertedAmount = 0
      }
    }
  },
  created () {
    this.setTokenCode()
    this.loadOffers()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
    }),
    setTokenCode () {
      this.form.quoteAsset = this.sale.quoteAssetCodes[0] || null
    },
    async loadOffers () {
      const response = await offersService.loadUserSaleOffers(this.sale.id)
      const records = response.records
      this.offers = records.map(record =>
        RecordFactory.createOfferRecord(record)
      )
    },
    async invest () {
      if (!await this.isValid()) return
      this.disable()
      try {
        if (!this.accountBalances[this.form.quoteAsset]) {
          await accountsService.createBalance(this.form.quoteAsset)
          await this.loadBalances()
        }

        if (!this.accountBalances[this.sale.baseAsset]) {
          await accountsService.createBalance(this.sale.baseAsset)
          await this.loadBalances()
        }
        const offerFees = await feeService.loadOfferFeeByAmount(
          this.form.quoteAsset,
          multiply(this.form.amount, this.price)
        )

        const cancelOpts = this.offer ? {
          baseBalance: _get(
            this.accountBalances,
            `${this.sale.baseAsset}.balance_id`
          ),
          quoteBalance: _get(
            this.accountBalances,
            `${this.form.quoteAsset}.balance_id`
          ),
          offerId: this.offer.id,
          price: this.price,
          orderBookId: this.sale.id
        } : null
        const createOpts = this.form.amount > 0 ? {
          amount: this.form.amount,
          price: this.price,
          orderBookId: this.sale.id,
          isBuy: true,
          baseBalance: _get(
            this.accountBalances,
            `${this.sale.baseAsset}.balance_id`
          ),
          quoteBalance: _get(
            this.accountBalances,
            `${this.form.quoteAsset}.balance_id`
          ),
          fee: offerFees.percent
        } : null
        await offersService.createSaleOffer(createOpts, cancelOpts)
        this.$emit(commonEvents.investInSale)
        this.loadBalances()
        this.loadOffers()
        EventDispatcher.dispatchShowSuccessEvent(
          i18n.sale_offer_created({ asset: this.sale.baseAsset })
        )
      } catch (error) { ErrorHandler.processUnexpected(error) }
      this.enable()
    },
    async cancelOffer () {
      this.disable()
      try {
        const cancelOpts = this.offer ? {
          baseBalance: _get(
            this.accountBalances, `${this.sale.baseAsset}.balance_id`
          ),
          quoteBalance: _get(
            this.accountBalances, `${this.form.quoteAsset}.balance_id`
          ),
          offerId: this.offer.id,
          price: this.price,
          orderBookId: this.sale.id
        } : null
        await offersService.cancelOffer(cancelOpts)
        this.$emit(commonEvents.investInSale)
        this.loadBalances()
        this.loadOffers()
        EventDispatcher.dispatchShowSuccessEvent(
          i18n.sale_offer_cancelled({ asset: this.sale.baseAsset })
        )
      } catch (err) {
        ErrorHandler.processUnexpected(err)
      }
      this.enable()
    }
  }
}
</script>

<style lang="scss">
@import "~L@scss/variables";
@import "~L@scss/mixins";

.invest__header {
  font-weight: bold;
  margin-bottom: 1.5rem;
  margin-top: 0.25rem;
  padding-top: 1rem;
  white-space: nowrap;
}

.invest__progress-bar-wrp {
  margin-bottom: 1rem;
}

.invest__select-quote-wrp {
  max-width: 5rem;
  margin-bottom: 0.75rem;
}

  .asset-wrp,
  .invest__input-quote-wrp {
    width: 40%;
  }

  .get__input-quote-wrp {
    width: 35%;
  }
.invest__input-quote-wrp,
.get__input-quote-wrp {
  width: 40%;
}

.invest__input-quote-wrp {
  display: flex;
  align-items: center;
}

.invest__amount-tooltip {
  position: relative;
  margin: 1 * $point;
  margin-left: 0;
}

.invest__input-field {
  @include respond-to-custom("1180px") {
    width: 69%;
  }
  @include respond-to(medium) {
    width: 100%;
  }
}

.invest__select-quote-assets {
  width: 85%;
  @include respond-to(medium) {
    width: 100%;
  }
}

.get__input-quote-wrp {
  font-size: 1rem;
  line-height: 2rem;
}

.invest__row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex: 1;

  &:not(:first-of-type) {
    margin-top: 3 * $point;
  }
}

.invest__row-unit {
  flex: 1;
  & + & {
    margin-left: 1.5 * $point;
  }

}

.invest__available-amount,
.invest__available-asset {
  color: $col-text-accented;
}

.invest__input-hint {
  font-size: 1.4 * $point;
  color: $col-text-field-hint;
  margin-top: 0.3 * $point;

  &--error {
    color: $col-accent;
    font-weight: bold;
    .invest__available-asset,
    .invest__available-amount {
      color: $col-accent;
    }
  }
}

.invest__action {
  margin-bottom: 1rem;
  .btn {
    display: block;
    text-decoration: none;
    width: 100%;
  }
}

.invest__tip {
  font-size: .8rem;
}

.invest__actions {
  margin-top: 3 * $point;
  display: flex;
  align-items: center;
  .invest__cancel-btn,
  .invest__submit-btn {
    margin: 0;
  }
}

.invest__convert-icon {
  align-self: center;
}

.invest__tooltip-icon {
  vertical-align: middle;
  font-size: 1rem;
}
.invest__max-value-btn {
  border: none;
  background: none;
  width: 4.4 * $point;
  height: 4.4 * $point;
  padding: 0;
  color: $col-button-flat-txt-inactive;
  cursor: pointer;

  &:hover {
    color: $col-button-flat-txt;
  }
}

.invest__cancel-btn-ctn {
  margin-left: 1.2 * $point;
}
</style>
