<template>
  <form
    novalidate
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
          :values="ownedTokenAssets"
          :label="'issuance.asset' | globalize"
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
            :label="'issuance.amount' | globalize"
            :error-message="getFieldErrorMessage(
              'form.amount',
              { from: 0.000001, to: availableAmount.value }
            )"
          />
          <div class="issuance-form__amount-label">
            <span>{{ availableAmount.currency }}</span>
          </div>
        </div>
        <div
          v-if="availableAmount"
          class="issuance-form__available"
        >
          <span>
            {{ 'issuance.available-for-issuance' | globalize }}
            {{ availableAmount | formatMoney }}
          </span>
        </div>
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.email"
          @blur="touchField('form.email')"
          id="create-issuance-email"
          :label="'issuance.email' | globalize"
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
          :label="'issuance.reference' | globalize"
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
        {{ 'issuance.issue' | globalize }}
      </button>
      <button
        v-ripple
        type="button"
        class="issuance-form__cancel-btn"
        :disabled="formMixin.isDisabled"
        @click.prevent="cancelForm"
      >
        {{ 'issuance.cancel' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SelectField from '@/vue/fields/SelectField'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { required, email, amountRange } from '@validators'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'issuance-form',
  components: {
    SelectField
  },
  mixins: [FormMixin],
  data: _ => ({
    form: {
      asset: '',
      amount: 0,
      email: '',
      reference: ''
    },
    ownedAssets: null
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
    ...mapGetters([
      vuexTypes.account
    ]),
    ownedTokenAssets () {
      if (this.ownedAssets) {
        return this.ownedAssets.map(token =>
          `${token.details.name} (${token.code})`
        )
      }
    },
    availableAmount () {
      if (this.ownedAssets && this.form.asset) {
        const token = this.ownedAssets.filter(token =>
          `${token.details.name} (${token.code})` === this.form.asset
        )[0]
        return {
          value: token.availableForIssuance,
          currency: token.code
        }
      }
    }
  },
  async created () {
    await this.loadAssets()
    if (this.ownedTokenAssets.length > 0) {
      this.form.asset = this.ownedTokenAssets[0]
    }
  },
  methods: {
    async loadAssets () {
      const response = await Sdk.horizon.account.getDetails(
        this[vuexTypes.account].accountId
      )
      this.ownedAssets = response.data.map(balance =>
        balance.assetDetails).filter(asset =>
        asset.owner === this[vuexTypes.account].accountId)
    },
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        const assetCode = this.form.asset.match(/\((.*?)\)/)[1]
        const receiverBalance =
          await this.getReceiverBalance(this.form.email, assetCode)

        if (receiverBalance) {
          const operation =
          base.CreateIssuanceRequestBuilder.createIssuanceRequest({
            asset: assetCode,
            amount: this.form.amount.toString(),
            receiver: receiverBalance.balanceId,
            reference: this.form.reference,
            externalDetails: {}
          })
          await Sdk.horizon.transactions.submitOperations(operation)
          Bus.success('issuance.tokens-issued')
          this.closeForm()
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
      Bus.error('issuance.wrong-email')
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
      Bus.error('issuance.balance-required')
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
