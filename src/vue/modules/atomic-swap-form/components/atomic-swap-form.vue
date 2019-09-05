<template>
  <div class="atomic-swap-form">
    <form
      novalidate
      v-if="!atomicSwapBidDetails.address"
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
          <input-field
            v-model="form.amount"
            @blur="touchField('form.amount')"
            name="atomic-swap-amount"
            type="number"
            :error-message="getFieldErrorMessage(
              'form.amount',
              {
                from: config.MIN_AMOUNT,
                to: atomicSwap.availableAmount,
              })"
            white-autofill
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
          <!-- eslint-disable max-len -->
          <readonly-field
            class="atomic-swap-form__price"
            :label="'atomic-swap-form.price' | globalize"
            :value="`${formatMoney(quoteAssetPrice)} ${statsQuoteAsset.code}`"
          />
          <!-- eslint-enable max-len -->
          <readonly-field
            :label="'atomic-swap-form.total-price' | globalize"
            :value="`${formatMoney(totalPrice)} ${statsQuoteAsset.code}`"
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
      :asset-code="assetByCode(form.quoteAsset).name"
      :amount="atomicSwapBidDetails.amount"
      :address="atomicSwapBidDetails.address"
      :end-time="atomicSwapBidDetails.endTime"
    />
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import ReadonlyField from '@/vue/fields/ReadonlyField'
import AddressViewer from '@/vue/common/address-viewer'
import config from '@/config'
import moment from 'moment'

import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { formatMoney } from '@/vue/filters/formatMoney'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { MathUtil } from '@/js/utils'

import { api } from '@/api'
import { base } from '@tokend/js-sdk'

import {
  amountRange,
  required,
} from '@validators'

const EVENTS = {
  selectAsset: 'select-asset',
  submitted: 'submitted',
}

const ATOMIC_SWAP_BID_TYPES = {
  redirect: 'redirect',
  cryptoInvoice: 'crypto_invoice',
}

const TRANSACTION_TIME_MARGIN = 600 // seconds

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
      isSubmitting: false,
      form: {
        amount: '',
        quoteAsset: '',
      },
      atomicSwapBidDetails: {
        address: '',
        endTime: -1,
        amount: '',
      },
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
      vuexTypes.assetByCode,
      vuexTypes.statsQuoteAsset,
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

        // eslint-disable-next-line max-len
        const { data: atomicSwapBid } = await api.postOperationsToSpecificEndpoint(
          '/integrations/marketplace/buy',
          createAtomicSwapBidOperation
        )

        if (atomicSwapBid.type === ATOMIC_SWAP_BID_TYPES.redirect) {
          window.location.href = atomicSwapBid.data.payUrl
        } else {
          this.atomicSwapBidDetails.amount = atomicSwapBid.data.amount
          this.atomicSwapBidDetails.address = atomicSwapBid.data.address
          this.atomicSwapBidDetails.endTime = moment().unix() +
            atomicSwapBid.data.timeout - TRANSACTION_TIME_MARGIN
        }
        this.$emit(EVENTS.submitted)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isSubmitting = false
      this.hideConfirmation()
    },

    buildCreateAtomicSwapBidOperation () {
      const operation = {
        askID: this.atomicSwap.id,
        baseAmount: this.form.amount,
        quoteAsset: this.form.quoteAsset,
        creatorDetails: {
          request_identifier: +new Date() + '',
        },
      }
      return base.CreateAtomicSwapBidRequestBuilder
        .createAtomicSwapBidRequest(operation)
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
