<template>
  <div class="transfer app__page-content-wrp">
    <template v-if="isLoaded">
      <template v-if="!assets.length">
        <h2 class="app__page-heading">
          {{ 'transfer-form.no-assets-heading' | globalize }}
        </h2>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ 'transfer-form.no-assets' | globalize }}
        </p>
        <router-link
          :to="vueRoutes.assets.name"
          tag="button"
          class="app__button-raised transfer-form__discover-asset-btn"
        >
          {{ 'transfer-form.discover-assets-btn' | globalize }}
        </router-link>
      </template>

      <template v-else>
        <form
          id="transfer-form"
          @submit.prevent="trySend"
        >
          <div class="app__form-row">
            <div class="app__form-field">
              <select-field
                name="transfer-asset"
                :value="form.asset.code"
                @input="setAsset"
                :label="'transfer-form.asset-lbl' | globalize"
                :readonly="formMixin.isDisabled"
              >
                <option
                  v-for="asset in assets"
                  :key="asset.code"
                  :value="asset.code"
                >
                  {{ asset.name }}
                </option>
              </select-field>
              <template v-if="form.asset.code">
                <p class="app__form-field-description">
                  {{
                    'transfer-form.balance' | globalize({
                      amount: balance.balance,
                      available: balance.balance
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
                name="transfer-amount"
                validation-type="outgoing"
                :max="balance.balance"
                :label="'transfer-form.amount-lbl' | globalize"
                :asset="form.asset"
                is-max-button-shown
                :readonly="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                name="transfer-recipient"
                v-model.trim="form.recipient"
                :label="'transfer-form.recipient-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.recipient')"
                @blur="touchField('form.recipient')"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <textarea-field
                name="transfer-description"
                v-model="form.subject"
                :label="'transfer-form.subject-lbl' | globalize({
                  length: 250
                })"
                :maxlength="250"
                :readonly="formMixin.isDisabled"
              />
            </div>
          </div>

          <div
            class="transfer__fee-box"
            v-if="isFeesLoaded && formMixin.isDisabled &&
              fees.isAny
            "
          >
            <fees-renderer
              :fees-collection="fees"
              :paid-for-destination.sync="form.isPaidForRecipient"
            />
          </div>

          <div class="app__form-actions">
            <template v-if="formMixin.isConfirmationShown">
              <form-confirmation
                message-id="transfer-form.approving-msg"
                @ok="trySend"
                @cancel="hideConfirmationForm"
              />
            </template>
            <button
              v-ripple
              v-if="!formMixin.isConfirmationShown"
              type="submit"
              class="app__form-submit-btn app__button-raised"
              :disabled="formMixin.isDisabled"
              form="transfer-form"
            >
              {{ 'transfer-form.submit-btn' | globalize }}
            </button>
          </div>
        </form>
      </template>
    </template>

    <template v-else-if="!isLoadingFailed">
      <transfer-form-skeleton-loader />
    </template>

    <template v-else>
      <p>
        {{ 'transfer-form.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import TransferFormSkeletonLoader from './TransferFormSkeletonLoader'

import FormMixin from '@/vue/mixins/form.mixin'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import { vueRoutes } from '@/vue-router/routes'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import FeesMixin from '@/vue/common/fees/fees.mixin'
import {
  base,
  FEE_TYPES,
} from '@tokend/js-sdk'
import config from '@/config'
import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'
import {
  required,
  // emailOrPhoneNumber,
  email,
} from '@validators'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

export default {
  name: 'transfers-form',
  components: {
    TransferFormSkeletonLoader,
  },
  mixins: [
    FormMixin,
    IdentityGetterMixin,
    FeesMixin,
  ],
  props: {
    assetToTransfer: { type: String, default: '' },
  },
  data: () => ({
    recipientAccountId: '',
    isSendingOnNotExistAccount: false,
    form: {
      asset: {},
      amount: '',
      recipient: '',
      subject: '',
      isPaidForRecipient: false,
    },
    fees: {},
    view: {
      opts: {},
    },
    isLoaded: false,
    isLoadingFailed: false,
    isFeesLoaded: false,
    vueRoutes,
    config,
    FEE_TYPES,
  }),
  validations () {
    return {
      form: {
        recipient: this.isSendingOnNotExistAccount
          ? { required, email }
          : { required },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.transferableBalancesAssetsByOwner,
      vuexTypes.accountBalanceByCode,
    ]),
    balance () {
      return this.accountBalanceByCode(this.form.asset.code)
    },
    assets () {
      if (this.$route && this.$route.query && this.$route.query.owner) {
        return this.transferableBalancesAssetsByOwner(this.$route.query.owner)
      } else {
        return this.transferableBalancesAssetsByOwner(this.accountId)
      }
    },
  },
  async created () {
    try {
      await this.loadCurrentBalances()
      this.setAsset()
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },
  methods: {
    globalize,
    ...mapActions({
      loadCurrentBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async submit () {
      if (!this.isFormValid()) return
      this.formMixin.isConfirmationShown = false
      try {
        await api.postOperations(this.buildPaymentOperation())

        Bus.success('transfer-form.payment-successful')
        this.$emit(EVENTS.operationSubmitted)

        await this.loadCurrentBalances()
        this.rerenderForm()
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },
    async trySend () {
      this.disableForm()
      const recipientAccountId =
        await this.getCounterparty(this.form.recipient)
      if (recipientAccountId) {
        this.isSendingOnNotExistAccount = false
        this.recipientAccountId = recipientAccountId
        this.submit()
      } else {
        if (this.formMixin.isConfirmationShown) {
          this.sendOnNotExistAccount()
        } else {
          this.isSendingOnNotExistAccount = true
          this.formMixin.isConfirmationShown = true
        }
      }
    },
    async sendOnNotExistAccount () {
      if (this.isFormValid()) {
        try {
          const { data } = await api.get('/integrations/payment-proxy/info')
          this.recipientAccountId = data.id
          this.submit()
        } catch (e) {
          ErrorHandler.process(e)
          this.enableForm()
        }
      } else {
        this.enableForm()
      }
    },
    async getCounterparty (recipient) {
      if (!base.Keypair.isValidPublicKey(recipient)) {
        return this.getAccountIdByIdentifier(recipient)
      } else {
        return recipient
      }
    },
    hideConfirmationForm () {
      this.enableForm()
      this.formMixin.isConfirmationShown = false
      this.isSendingOnNotExistAccount = false
    },
    buildPaymentOperation () {
      let subject = {
        subject: this.form.subject,
      }
      if (this.isSendingOnNotExistAccount) {
        subject.sender = this.accountId
        subject.email = this.form.recipient
      }
      subject = JSON.stringify(subject)
      return base.PaymentBuilder.payment({
        sourceBalanceId: this.balance.id,
        destination: this.recipientAccountId,
        amount: this.form.amount,
        feeData: {
          sourceFee: {
            percent: '0',
            fixed: '0',
          },
          destinationFee: {
            percent: '0',
            fixed: '0',
          },
          sourcePaysForDest: this.form.isPaidForRecipient,
        },
        subject: subject,
        asset: this.form.asset.code,
      })
    },
    rerenderForm () {
      this.isFeesLoaded = false
      setTimeout(() => {
        this.clearFields()
        this.setAsset()
      }, 1)
    },
    setAsset (payload) {
      const assetCode = payload || this.assetToTransfer
      this.form.asset = this.assets
        .find(asset => asset.code === assetCode) ||
        this.assets[0] ||
        {}
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import '~@scss/variables';

.transfer__fee-box {
  padding-top: 4rem;
}

.transfer__fee-box-heading {
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 400;
  display: block;
  font-size: 1.6rem;
  color: $col-text-page-heading;
}

.transfer__fee-box-heading:not(:first-child) {
  margin-top: 2.5rem;
}

.transfer__fee {
  color: $col-details-value;
  font-size: 1.6rem;
  line-height: 1.5;
  margin: 0;
}

.transfer__no-fee-msg {
  color: $col-details-label;
  font-size: 1.6rem;
  line-height: 1.5;
  margin: 1rem 0;
}

.transfer__fee-type {
  color: $col-details-label;
}

.transfer-form__discover-asset-btn {
  margin-top: 2.5rem;
}
</style>
