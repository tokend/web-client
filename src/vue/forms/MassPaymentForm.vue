<template>
  <div class="mass-payment-form">
    <template v-if="isLoaded && transferableBalancesAssets.length">
      <form @submit.prevent="submit()">
        <div class="app__form-row">
          <div class="app__form-field">
            <p class="mass-payment-form__description">
              {{ 'mass-payment-form.how-to-receivers-paragraph' | globalize }}
            </p>

            <textarea-field
              name="mass-payment-receivers"
              v-model="form.receivers"
              :label="'mass-payment-form.receivers-lbl' | globalize"
              :disabled="formMixin.isDisabled"
              @blur="touchField('form.receivers')"
              :error-message="getFieldErrorMessage('form.receivers')"
              rows="8"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              name="mass-payment-asset-code"
              v-model="form.assetCode"
              :label="'mass-payment-form.asset-lbl' | globalize"
              @blur="touchField('form.assetCode')"
              :error-message="getFieldErrorMessage('form.assetCode')"
              :disabled="formMixin.isDisabled"
            >
              <option
                v-for="asset in transferableBalancesAssets"
                :key="asset.code"
                :value="asset.code"
              >
                {{ asset.name }}
              </option>
            </select-field>

            <template v-if="form.assetCode">
              <p class="app__form-field-description">
                {{
                  'mass-payment-form.available-for-payment-hint' | globalize({
                    amount: {
                      value: accountBalance.balance,
                      currency: form.assetCode
                    }
                  })
                }}
              </p>
            </template>
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <amount-input-field
              v-model="form.amount"
              name="mass-payment-amount"
              validation-type="outgoing"
              :label="'mass-payment-form.amount-lbl' | globalize"
              :asset="assetByCode(form.assetCode)"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>

        <div class="app__form-actions">
          <button
            v-ripple
            :disabled="formMixin.isDisabled"
            class="app__form-submit-btn app__button-raised"
            type="submit"
          >
            {{ 'mass-payment-form.submit-btn' | globalize }}
          </button>
        </div>
      </form>
    </template>

    <template v-else>
      <no-data-message
        class="mass-payment-form__no-data-message"
        :title="'mass-payment-form.no-assets-msg-title' | globalize"
        :message="'mass-payment-form.no-assets-msg-description' | globalize"
      />
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { required } from '@validators'

import { CsvUtil } from '@/js/utils/csv.util'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { MathUtil } from '@/js/utils'

const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'mass-payment-form',

  components: { NoDataMessage },

  mixins: [FormMixin, IdentityGetterMixin],

  props: {
    assetCode: { type: String, default: '' },
    receivers: { type: String, default: '' },
    amount: { type: [String, Number], default: '' },
  },

  data () {
    return {
      form: {
        assetCode: '',
        receivers: this.receivers || '',
        amount: String(this.amount) || '',
      },
      isLoaded: false,
    }
  },

  validations () {
    return {
      form: {
        assetCode: {
          required,
        },
        receivers: {
          required,
        },
      },
    }
  },

  computed: {
    ...mapGetters({
      transferableBalancesAssets: vuexTypes.transferableBalancesAssets,
      assetByCode: vuexTypes.assetByCode,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),

    accountBalance () {
      return this.accountBalanceByCode(this.form.assetCode)
    },
  },

  async created () {
    await this.loadCurrentBalances()
    this.form.assetCode = this.assetCode || this.transferableBalancesAssets[0].code || ''
    this.isLoaded = true
  },

  methods: {
    ...mapActions({
      loadCurrentBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async submit () {
      if (!this.isFormValid) return
      this.disableForm()

      try {
        const operations = await this.buildOperationsToSubmit()

        if (!operations.length) {
          Bus.error('mass-payment-form.no-receivers-found')
          this.enableForm()
          return
        }

        // Core cannot handle more than 100 operations per transaction
        if (operations.length >= 100) {
          Bus.error('mass-payment-form.too-much-op-error-notif')
          this.enableForm()
          return
        }

        const isOverpayment = MathUtil.compare(
          MathUtil.multiply(operations.length, this.form.amount),
          this.accountBalance.balance,
        ) > 0
        if (isOverpayment) {
          Bus.error('mass-payment-form.overpayment-error-notif')
          this.enableForm()
          return
        }

        await api.postOperations(...operations)

        await this.loadCurrentBalances()
        this.clearFieldsWithOverriding({
          receivers: this.form.receivers,
          assetCode: this.form.assetCode,
        })
        this.$emit(EVENTS.submitted)
        Bus.success('mass-payment-form.payment-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }

      this.enableForm()
    },

    async buildOperationsToSubmit () {
      const emails = CsvUtil.parseConcat(this.form.receivers, {
        trim: true,
        filterEmpty: true,
        delimiters: CsvUtil.delimiters.common,
      })

      const accountIds =
        await this.getAccountIdByEmailMass(emails, this.form.assetCode)

      const operations = accountIds.map((accId, id) => base
        .PaymentBuilder.payment({
          sourceBalanceId: this.accountBalance.id,
          destination: accId,
          amount: String(this.form.amount),
          feeData: {
            sourceFee: {
              percent: '0',
              fixed: '0',
            },
            destinationFee: {
              percent: '0',
              fixed: '0',
            },
            sourcePaysForDest: false,
          },
          subject: '',
          asset: this.form.assetCode,
        }))

      return operations
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import '@/scss/variables';

p.mass-payment-form__description {
  line-height: 1.5;
  font-size: 1.6rem;
  margin-bottom: 2.4rem;
}
</style>
