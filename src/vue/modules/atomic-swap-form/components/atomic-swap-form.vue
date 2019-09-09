<template>
  <div class="atomic-swap-form">
    <form
      novalidate
      v-if="!atomicSwapBidRecord.address"
      class="app__form"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            :label="'atomic-swap-form.asset-in-which-buying' | globalize"
            name="atomic-swap-quote-asset"
            :value="form.quoteAsset"
            @input="setQuoteAsset"
            :disabled="formMixin.isDisabled"
            class="app__select"
          >
            <option
              v-for="asset in quoteAssets"
              :key="asset.code"
              :value="asset.code"
            >
              {{ asset.name }}
            </option>
          </select-field>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <amount-input-field
            v-model="form.amount"
            name="atomic-swap-amount"
            :asset="assetByCode(atomicSwap.baseAsset)"
            :max="atomicSwap.availableAmount"
            :label="'atomic-swap-form.amount' | globalize({
              asset: atomicSwap.baseAssetName
            })"
            :disabled="formMixin.isDisabled"
          />
          <p class="app__form-field-description">
            {{ 'atomic-swap-form.available' | globalize({
              amount: atomicSwap.availableAmount,
              asset: '',
            }) }}
          </p>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <readonly-field
            class="atomic-swap-form__price"
            :label="'atomic-swap-form.price' | globalize"
            :value="`${formatMoney(quoteAssetPrice)} ${form.quoteAsset}`"
          />
          <readonly-field
            :label="'atomic-swap-form.total-price' | globalize"
            :value="`${formatMoney(totalPrice)} ${form.quoteAsset}`"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          :is-pending="isSubmitting"
          @ok="submit()"
          @cancel="hideConfirmation()"
        />

        <button
          v-else
          v-ripple
          type="submit"
          :disabled="formMixin.isDisabled"
          class="app__button-raised atomic-swap-form__btn"
        >
          <template>
            {{ 'atomic-swap-form.buy' | globalize }}
          </template>
        </button>
      </div>
    </form>
    <address-viewer
      v-else
      :asset-code="atomicSwapBidRecord.quoteAssetCode"
      :amount="atomicSwapBidRecord.amount"
      :address="atomicSwapBidRecord.address"
      :end-time="atomicSwapBidRecord.endTime"
    />
    <p v-if="isFailedLoadAtomicSwapBidRecord">
      {{ 'atomic-swap-form.error-msg' | globalize }}
    </p>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import ReadonlyField from '@/vue/fields/ReadonlyField'
import AddressViewer from '@/vue/common/address-viewer'
import config from '@/config'

import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { AtomicSwapBidRecord } from '../wrappers/atomic-swap-bid.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { formatMoney } from '@/vue/filters/formatMoney'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { MathUtil } from '@/js/utils'

import { api } from '@/api'
import { base } from '@tokend/js-sdk'

import { REQUEST_STATES } from '@/js/const/request-states.const'

import {
  amountRange,
  required,
} from '@validators'

const EVENTS = {
  selectAsset: 'select-asset',
  submitted: 'submitted',
}
export default {
  name: 'atomic-swap-form',
  components: {
    ReadonlyField,
    AddressViewer,
  },
  mixins: [FormMixin],
  props: {
    atomicSwap: {
      type: AtomicSwapRecord,
      required: true,
    },
  },
  data () {
    return {
      config,
      loadTickerTimeout: 3000,
      intervalId: '',
      isSubmitting: false,
      isFailedLoadAtomicSwapBidRecord: false,
      requestIdentifier: '', // TODO: remove, crutch because back
      form: {
        amount: '',
        quoteAsset: '',
      },
      atomicSwapBidRecord: {},
    }
  },
  validations () {
    return {
      form: {
        amount: {
          amountRange: amountRange(
            config.MIN_AMOUNT,
            this.atomicSwap.availableAmount
          ),
          required,
        },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.assetByCode,
      vuexTypes.walletAccountId,
    ]),
    quoteAssets () {
      return this.atomicSwap.quoteAssets.map(item => this.assetByCode(item.id))
    },
    quoteAssetPrice () {
      return this.atomicSwap.quoteAssets
        .find(item => item.id === this.form.quoteAsset)
        .price
    },
    totalPrice () {
      return MathUtil.multiply(this.quoteAssetPrice, this.form.amount || 0)
    },
  },
  watch: {
    'form.quoteAsset' (value) {
      this.$emit(EVENTS.selectAsset, value)
    },
  },
  async created () {
    this.form.quoteAsset = this.atomicSwap.quoteAssets[0].id
  },
  destroyed () {
    clearInterval(this.intervalId)
  },
  methods: {
    formatMoney,
    setQuoteAsset (code) {
      this.form.quoteAsset = code
    },
    async submit () {
      try {
        this.isSubmitting = true
        const createAtomicSwapBidOperation =
          this.buildCreateAtomicSwapBidOperation()
        if (this.assetByCode(this.form.quoteAsset).isCoinpayments) {
          await api.postOperations(createAtomicSwapBidOperation)
          this.intervalId = setInterval(() => {
            this.loadPendingAtomicSwapBidRequests()
          }, this.loadTickerTimeout)
        } else {
          const response =
          await api.postOperationsToSpecificEndpoint(
            '/integrations/fiat/pay',
            createAtomicSwapBidOperation
          )
          window.location.href = response.data.data.attributes.payUrl
        }
        this.$emit(EVENTS.submitted)
      } catch (e) {
        ErrorHandler.process(e)
        this.isSubmitting = false
        this.hideConfirmation()
      }
    },

    buildCreateAtomicSwapBidOperation () {
      this.requestIdentifier = +new Date() + ''
      const operation = {
        askID: this.atomicSwap.id,
        baseAmount: this.form.amount,
        quoteAsset: this.form.quoteAsset,
        creatorDetails: {
          request_identifier: this.requestIdentifier,
        },
      }
      return base.CreateAtomicSwapBidRequestBuilder
        .createAtomicSwapBidRequest(operation)
    },

    async loadPendingAtomicSwapBidRequests () {
      try {
        const endpoint = '/v3/create_atomic_swap_bid_requests'
        const response = await api.getWithSignature(endpoint, {
          filter: {
            requestor: this.accountId,
            state: REQUEST_STATES.pending,
          },
          page: {
            order: 'desc',
            limit: 3,
          },
          include: 'request_details',
        })
        const records = response.data
          .map(item => new AtomicSwapBidRecord(item))
        const newAtomicSwapBidRecord = records
          .find(item => item.requestIdentifier === this.requestIdentifier)
        if (newAtomicSwapBidRecord && newAtomicSwapBidRecord.address) {
          this.atomicSwapBidRecord = newAtomicSwapBidRecord
          clearInterval(this.intervalId)
          this.isSubmitting = false
          this.hideConfirmation()
        }
      } catch (e) {
        this.isFailedLoadAtomicSwapBidRecord = true
        ErrorHandler.processWithoutFeedback(e)
        this.isSubmitting = false
        this.hideConfirmation()
        clearInterval(this.intervalId)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';

  .atomic-swap-form__price {
    margin-bottom: 0.5rem;
  }

  .atomic-swap-form__btn {
    max-width: 14rem;
    width: 100%;
  }
</style>
