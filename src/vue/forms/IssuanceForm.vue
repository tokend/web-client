<template>
  <form
    novalidate
    v-if="ownedAssets.length"
    class="app__form issuance-form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <!--
          :key is a hack to ensure that the component will be updated
          after property change
        -->
        <select-field
          :key="form.asset"
          v-model="form.asset"
          :values="assetListValues"
          :label="'issuance.asset-lbl' | globalize"
          id="create-issuance-asset"
          @blur="touchField('form.asset')"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <div
          v-if="availableAmount"
          class="issuance-form__amount"
        >
          <input-field
            white-autofill
            type="number"
            v-model="form.amount"
            @blur="touchField('form.amount')"
            id="create-issuance-amount"
            :label="'issuance.amount-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.amount',
              { from: 0.000001, to: availableAmount.value }
            )"
          />
          <p class="issuance-form__amount-label">
            {{ availableAmount.currency }}
          </p>
        </div>
        <p class="issuance-form__available-amount-hint">
          {{ 'issuance.available-for-issuance-lbl' | globalize }}
          {{ availableAmount | formatMoney }}
        </p>
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.email"
          @blur="touchField('form.email')"
          id="create-issuance-email"
          :label="'issuance.email-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.email')"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.reference"
          @blur="touchField('form.reference')"
          id="create-issuance-reference"
          :error-message="getFieldErrorMessage('form.reference')"
          :label="'issuance.reference-lbl' | globalize"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="issuance-form__submit-btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'issuance.issue-btn' | globalize }}
      </button>
      <button
        v-ripple
        type="button"
        class="issuance-form__cancel-btn"
        :disabled="formMixin.isDisabled"
        @click.prevent="cancelForm"
      >
        {{ 'issuance.cancel-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import IssuanceFormMixin from '@/vue/mixins/issuance-form.mixin'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { required, email, amountRange } from '@validators'

export default {
  name: 'issuance-form',
  mixins: [IssuanceFormMixin],
  data: _ => ({
    form: {
      asset: '',
      amount: 0,
      email: '',
      reference: ''
    }
  }),
  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          amountRange: amountRange(
            0.000001,
            this.availableAmount ? this.availableAmount.value : 0
          )
        },
        email: { required, email },
        reference: { required }
      }
    }
  },
  computed: {
    assetListValues () {
      if (this.ownedAssets) {
        return this.ownedAssets
          .map(asset => ({
            value: asset.code,
            label: `${asset.details.name} (${asset.code})`
          }))
      }
    },
    availableAmount () {
      if (this.ownedAssets && this.form.asset) {
        const asset = this.ownedAssets
          .find(asset => asset.code === this.form.asset)
        return {
          value: asset.availableForIssuance,
          currency: asset.code
        }
      }
      return null
    }
  },
  async created () {
    await this.loadAssets()
    if (this.assetListValues.length > 0) {
      this.form.asset = this.assetListValues[0].value
    }
  },
  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        const receiverBalance =
          await this.getReceiverBalance(this.form.email, this.form.asset)

        if (receiverBalance) {
          const operation =
            base.CreateIssuanceRequestBuilder.createIssuanceRequest({
              asset: this.form.asset,
              amount: this.form.amount.toString(),
              receiver: receiverBalance.balanceId,
              reference: this.form.reference,
              externalDetails: {}
            })
          await Sdk.horizon.transactions.submitOperations(operation)
          Bus.success('issuance.tokens-issued-msg')
          this.cancelForm()
        }
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async getAccountInfoByEmail (email) {
      const response = await Sdk.api.users.getPage({ email: email })
      const account = response.data.find(info => info.email === email)
      if (account) return account
      Bus.error('issuance.wrong-email-err')
      return null
    },
    async getReceiverBalance (email, asset) {
      const receiverAccount = await this.getAccountInfoByEmail(email)
      if (!receiverAccount) return null

      const response =
        await Sdk.horizon.account.getBalances(receiverAccount.id)
      const receiverBalance = response.data
        .find(balance => balance.asset === asset)

      if (receiverBalance) return receiverBalance
      Bus.error('issuance.balance-required-err')
      return null
    },
    cancelForm () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './issuance-form';
</style>
