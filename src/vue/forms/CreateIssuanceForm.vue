<template>
  <form
    v-if="isShown"
    class="app-form issuance-form"
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
        <div class="issuance-form__amount">
          <input-field
            type="number"
            v-model="form.amount"
            @blur="touchField('form.amount')"
            id="create-issuance-amount"
            :label="'issuance.amount' | globalize"
            :error-message="getFieldErrorMessage('form.amount')"
          />
          <div
            v-if="availableTokensAmount"
            class="issuance-form__amount-label"
          >
            <span>{{ availableTokensAmount.currency }}</span>
          </div>
        </div>
        <div
          v-if="availableTokensAmount"
          class="issuance-form__available"
        >
          <span>
            {{ 'issuance.available-for-issuance' | globalize }}
            {{ availableTokensAmount | formatMoney }}
          </span>
        </div>
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
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
        @click.prevent="closeForm"
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

import { required, email, between } from '@validators'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'create-issuance-form',
  components: {
    SelectField
  },
  mixins: [FormMixin],
  props: {
    isShown: { type: Boolean, default: true }
  },
  data: _ => ({
    form: {
      asset: '',
      amount: 0.00001,
      email: '',
      reference: ''
    },
    userOwnedTokens: null
  }),
  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          amount: between(
            0.000001,
            this.availableTokensAmount ? this.availableTokensAmount.value : 0
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
      if (this.userOwnedTokens) {
        return this.userOwnedTokens.map(token =>
          `${token.details.name} (${token.code})`
        )
      }
    },
    availableTokensAmount () {
      if (this.userOwnedTokens && this.form.asset) {
        const token = this.userOwnedTokens.filter(token =>
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
    await this.loadUserOwnedTokens()
    if (this.ownedTokenAssets.length > 0) {
      this.form.asset = this.ownedTokenAssets[0]
    }
  },
  methods: {
    async loadUserOwnedTokens () {
      const response = await Sdk.horizon.account.getDetails(
        this[vuexTypes.account].id
      )
      this.userOwnedTokens = response.data.map(balance =>
        balance.assetDetails).filter(asset =>
        asset.owner === this[vuexTypes.account].id)
    },
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        const assetCode = this.form.asset.match(/\((.*?)\)/)[1]
        const receiverAccount = (await Sdk.api.users.getPage({
          email: this.form.email
        })).data.filter(info => info.email === this.form.email)[0]

        if (!receiverAccount) {
          Bus.error('errors.wrong-email')
          this.enableForm()
          return
        }

        const receiverBalance = (await Sdk.horizon.account.getBalances(
          receiverAccount.id
        )).data.filter(balance => balance.asset === assetCode)[0]

        if (!receiverBalance) {
          Bus.error('errors.balance-required')
          this.enableForm()
          return
        }

        const operation =
          base.CreateIssuanceRequestBuilder.createIssuanceRequest({
            asset: assetCode,
            amount: this.form.amount.toString(),
            receiver: receiverBalance.balanceId,
            reference: this.form.reference,
            externalDetails: {}
          })
        await Sdk.horizon.transactions.submitOperations(operation)
        Bus.success('status-message.tokens-issued')
        this.closeForm()
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    closeForm () {
      this.$emit('update:isShown', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './issuance-form';
</style>
