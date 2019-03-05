<template>
  <div>
    <div v-if="!isAccountCorporate">
      <p>
        {{ 'issuance.not-available' | globalize }}
      </p>
    </div>
    <div
      v-else-if="isLoaded && ownedAssets.length"
      class="issuance-form"
    >
      <form
        novalidate
        class="app__form"
        @submit.prevent="isFormValid() && showConfirmation()"
      >
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              v-model="form.asset"
              :values="ownedAssets"
              name="issuance-asset"
              key-as-value-text="nameAndCode"
              :label="'issuance.asset-lbl' | globalize"
              id="issuance-asset"
              @blur="touchField('form.asset')"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <div class="issuance-form__amount-wrapper">
              <input-field
                white-autofill
                type="number"
                v-model="form.amount"
                @blur="touchField('form.amount')"
                id="issuance-amount"
                name="issuance-amount"
                :label="'issuance.amount-lbl' | globalize"
                :error-message="getFieldErrorMessage(
                  'form.amount',
                  {
                    from: MIN_AMOUNT,
                    to: form.asset.availableForIssuance,
                    maxDecimalDigitsCount: DECIMAL_POINTS
                  }
                )"
                :disabled="formMixin.isDisabled"
              />
              <p
                v-if="form.asset.code"
                class="issuance-form__issuance-asset-code"
              >
                {{ form.asset.code }}
              </p>
            </div>
            <p
              v-if="form.asset.availableForIssuance"
              class="app__form-field-description"
            >
              <!-- eslint-disable-next-line max-len -->
              {{ 'issuance.available-for-issuance-hint' | globalize({ value: form.asset.availableForIssuance }) }}
            </p>
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.receiver"
              @blur="touchField('form.receiver')"
              id="issuance-receiver"
              name="issuance-receiver"
              :label="'issuance.receiver-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.receiver')"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.reference"
              @blur="touchField('form.reference')"
              id="issuance-reference"
              name="issuance-reference"
              :error-message="getFieldErrorMessage(
                'form.reference',
                { length: REFERENCE_MAX_LENGTH }
              )"
              :label="'issuance.reference-lbl' | globalize"
              :maxlength="REFERENCE_MAX_LENGTH"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-actions">
          <form-confirmation
            v-if="formMixin.isConfirmationShown"
            @ok="hideConfirmation() || submit()"
            @cancel="hideConfirmation"
          />
          <button
            v-else
            v-ripple
            type="submit"
            class="issuance-form__submit-btn"
            :disabled="formMixin.isDisabled"
          >
            {{ 'issuance.issue-btn' | globalize }}
          </button>
        </div>
      </form>
    </div>
    <div v-else-if="isLoaded && !ownedAssets.length">
      <p>
        {{ 'issuance.no-owned-assets-msg' | globalize }}
      </p>
    </div>
    <div v-else>
      <loader :message-id="'issuance.loading-msg'" />
    </div>
  </div>
</template>

<script>
import OwnedAssetsLoaderMixin from '@/vue/mixins/owned-assets-loader.mixin'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import FormMixin from '@/vue/mixins/form.mixin'

import Loader from '@/vue/common/Loader'

import config from '@/config'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import {
  required,
  amountRange,
  emailOrAccountId,
  email,
  maxLength,
  maxDecimalDigitsCount,
} from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const REFERENCE_MAX_LENGTH = 255
const EVENTS = {
  close: 'close',
}

export default {
  name: 'issuance-form',
  components: {
    Loader,
  },
  mixins: [IdentityGetterMixin, OwnedAssetsLoaderMixin, FormMixin],
  data: _ => ({
    form: {
      asset: {},
      amount: '0',
      receiver: '',
      reference: '',
    },
    config,
    isLoaded: false,
    MIN_AMOUNT: config.MIN_AMOUNT,
    REFERENCE_MAX_LENGTH,
    DECIMAL_POINTS: config.DECIMAL_POINTS,
  }),
  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          amountRange: amountRange(
            this.MIN_AMOUNT,
            this.form.asset.availableForIssuance
          ),
          maxDecimalDigitsCount: maxDecimalDigitsCount(config.DECIMAL_POINTS),
        },
        receiver: { required, emailOrAccountId },
        reference: {
          required,
          maxLength: maxLength(REFERENCE_MAX_LENGTH),
        },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
    ]),
  },
  async created () {
    try {
      await this.initAssetSelector()
      this.isLoaded = true
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  },
  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()

      try {
        const receiverBalance = await this.getReceiverBalance(
          this.form.receiver,
          this.form.asset.code
        )
        if (receiverBalance) {
          const operation =
            base.CreateIssuanceRequestBuilder.createIssuanceRequest({
              asset: this.form.asset.code,
              amount: this.form.amount.toString(),
              receiver: receiverBalance.balanceId,
              reference: this.form.reference,
              creatorDetails: {},
            })
          await Sdk.horizon.transactions.submitOperations(operation)
          await this.reinitAssetSelector()
          Bus.success('issuance.assets-issued-msg')
          this.$emit(EVENTS.close)
        } else {
          Bus.error('issuance.balance-required-err')
        }
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.enableForm()
    },
    async getReceiverBalance (receiver, asset) {
      const receiverAccountId = await this.getReceiverAccountId(receiver)
      const { data } =
        await Sdk.horizon.account.getBalances(receiverAccountId)
      const receiverBalance = data.find(balance => balance.asset === asset)
      return receiverBalance
    },
    async getReceiverAccountId (receiver) {
      if (email(receiver)) {
        return this.getAccountIdByEmail(receiver)
      }
      return receiver
    },
    async initAssetSelector () {
      await this.loadOwnedAssets()
      if (this.ownedAssets.length) {
        this.form.asset = this.ownedAssets[0]
      }
    },
    async reinitAssetSelector () {
      await this.loadOwnedAssets()
      if (this.ownedAssets.length) {
        const updatedAsset = this.ownedAssets
          .find(item => item.code === this.form.asset.code)
        this.form.asset = updatedAsset || this.assets[0]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./app-form";

.issuance-form__submit-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}

.issuance-form__amount-wrapper {
  display: flex;
}

.issuance-form__issuance-asset-code {
  margin-left: 1rem;
  padding-top: 1.8rem;
  font-size: 1.8rem;
}
</style>
