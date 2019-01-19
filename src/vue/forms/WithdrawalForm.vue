<template>
  <div class="withdrawal">
    <template v-if="tokenCodes.length">
      <div class="app__page-content-wrp">
        <form
          @submit.prevent="processTransfer"
          id="withdrawal-form"
          v-if="view.mode === VIEW_MODES.submit ||
            view.mode === VIEW_MODES.confirm">
          <div class="app__form-row">
            <div class="app__form-field">
              <select-field
                :values="tokenCodes"
                v-model="form.tokenCode"
                :label="'withdrawal-form.asset' | globalize"
                :readonly="view.mode === VIEW_MODES.confirm" />
              <div class="app__form-field-description">
                <p>
                  {{
                    'withdrawal-form.balance' | globalize({
                      amount: balance.balance,
                      asset: form.tokenCode
                    })
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                v-model.trim="form.amount"
                @blur="touchField('form.amount')"
                :error-message="getFieldErrorMessage(
                  'form.amount',
                  { from:MIN_AMOUNT, to:balance.balance }
                )"
                :label="'withdrawal-form.amount' | globalize"
                type="number"
                name="amount"
                :title="'withdrawal-form.amount' | globalize"
                :readonly="view.mode === VIEW_MODES.confirm"
              />

              <div
                class="withdraw__fees-container app__form-field-description"
                :class="{ loading: isFeesLoadPending }">
                <p>
                  - {{ 'withdrawal-form.network-fee-prefix' | globalize }}
                  <span class="fee__fee-type">
                    {{ 'withdrawal-form.network-fee' | globalize }}
                  </span>
                  <hint-wrapper
                    :hint="'withdrawal-form.network-fee-hint' | globalize"
                    :decorated="false">
                    <span class="fee__hint-icon">
                      <i class="mdi mdi-help-circle" />
                    </span>
                  </hint-wrapper>
                </p>

                <p v-if="fixedFee">
                  - {{ fixedFee }} {{ form.tokenCode }}
                  <span class="fee__fee-type">
                    {{ 'withdrawal-form.fixed-fee' | globalize }}
                  </span>
                </p>

                <p v-if="percentFee">
                  - {{ percentFee }} {{ form.tokenCode }}
                  <span class="fee__fee-type">
                    {{ 'withdrawal-form.percent-fee' | globalize }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="app__form-row">
            <input-field
              v-model.trim="form.wallet"
              @blur="touchField('form.wallet')"
              :error-message="getFieldErrorMessage('form.wallet')"
              :label="'withdrawal-form.destination-address' |
                globalize({ asset: form.tokenCode })"
              :monospaced="true"
              name="wallet-address"
              :readonly="view.mode === VIEW_MODES.confirm"
            />
          </div>
        </form>

        <div class="app__form-actions">
          <button
            v-ripple
            v-if="view.mode === VIEW_MODES.submit"
            type="submit"
            class="app__button-raised withdrawal__btn-margin"
            :disabled="isPending"
            form="withdrawal-form">
            {{ 'withdrawal-form.withdrawal' | globalize }}
          </button>

          <form-confirmation
            v-if="view.mode === VIEW_MODES.confirm"
            :pending="isPending"
            @cancel="updateView(VIEW_MODES.submit)"
            @ok="submit"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <h2 class="app__page-heading">
        {{ 'withdrawal-form.no-assets-heading' | globalize }}
      </h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ 'withdrawal-form.no-assets' | globalize }}
      </p>
      <router-link
        to="/tokens"
        tag="button"
        class="app__button-raised withdrawal__btn-margin">
        {{ 'withdrawal-form.discover-assets-btn' | globalize }}
      </router-link>
    </template>
  </div>
</template>

<script>
import config from '@/config'
// import get from 'lodash/get'
import debounce from 'lodash/debounce'
import FormMixin from '@/vue/mixins/form.mixin'
import HintWrapper from '@/vue/common/HintWrapper'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { ASSET_POLICY, FEE_TYPE } from '@/js/const/xdr.const'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { Sdk } from '@/sdk'
import { required, amountRange, address } from '@validators'

const VIEW_MODES = {
  submit: 'submit',
  confirm: 'confirm',
  success: 'success',
}

export default {
  name: 'withdrawal-form',
  components: {
    HintWrapper,
  },
  mixins: [FormMixin],
  props: {
    // art: { type: Object, required: true },
  },
  data () {
    return {
      VIEW_MODES,
      view: {
        mode: VIEW_MODES.submit,
        opts: {},
      },
      form: {
        tokenCode: null,
        amount: '',
        wallet: '',
      },
      MIN_AMOUNT: config.MIN_AMOUNT,
      fixedFee: '',
      percentFee: '',
      isFeesLoadPending: false,
      isFeesLoadFailed: false,
      feesDebouncedRequest: null,
      isPending: false, // !!!!!!!!!!!!!!!! temp
    }
  },
  validations () {
    return {
      form: {
        tokenCode: { required },
        amount: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.balance.balance),
        },
        wallet: { required, address },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.account,
      vuexTypes.accountId,
      vuexTypes.balancesDetails,
      vuexTypes.accountDepositAddresses,
    ]),
    tokenCodes () {
      return this.balancesDetails
        .filter(item => {
          return item.assetDetails.policies.map(policy => policy.value)
            .indexOf(ASSET_POLICY.withdrawable) !== -1
        })
        .map(item => item.asset)
    },
    balance () {
      return this.balancesDetails
        .find(item => item.asset === this.form.tokenCode)
    },
    isAllowedToSubmit () {
      return !this.isFeesLoadPending
    },
  },
  watch: {
    'form.amount' (value) {
      // if (this.isLimitExceeded) return // isFormValid
      if (value === '' || value < +this.MIN_AMOUNT) {
        this.fixedFee = '0.0000'
        this.percentFee = '0.0000'
        return
      }
      this.tryGetFees()
    },
    'form.tokenCode' (value) {
      this.tryGetFees()
    },
  },
  created () {
    this.form.tokenCode = 'BTC'
  },
  destroyed () {
  },
  methods: {
    async getFees () {
      try {
        const fees = await Sdk.horizon.fees.get(FEE_TYPE.withdrawalFee, {
          account: this.accountId,
          asset: this.form.tokenCode,
          amount: this.form.amount,
        })
        this.fixedFee = fees.fixed
        this.percentFee = fees.percent
        this.isFeesLoadFailed = false
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.process(e)
        console.error(e)
      }
      this.isFeesLoadPending = false
    },
    tryGetFees () {
      this.isFeesLoadPending = true
      if (!this.feesDebouncedRequest) {
        this.feesDebouncedRequest = debounce(() => this.getFees(), 300)
      }
      return this.feesDebouncedRequest()
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "@/scss/variables";

  .withdraw__fees-container {
    &.loading {
      opacity: 0.7;
    }

    .fee__fee-type {
      color: $col-info;
    }
  }

  .withdrawal__btn-margin {
    margin-top: 2.5rem;
  }
</style>
