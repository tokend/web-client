<template>
  <form class="app-form issuance-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <!--
          :key is a hack to ensure that the component will be updated
          after computed calculated
        -->
        <select-field-unchained
          :key="form.asset"
          v-model="form.asset"
          :values="ownedTokensAssets"
          :label="'Asset' | globalize"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <div class="issuance-form__amount">
          <input-field
            type="number"
            step="0.00001"
            v-model="form.amount"
            @blur="_touchField('form.amount')"
            id="create-issuance-amount"
            :label="'Amount' | globalize"
            :error-message="_getErrorMessage('form.amount')"
          />
          <div class="issuance-form__amount-label">
            <span>{{ availableTokensAmount.currency }}</span>
          </div>
        </div>
        <div class="issuance-form__available">
          <span>
            Available for issuance: {{ availableTokensAmount | formatMoney }}
          </span>
        </div>
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="_touchField('form.email')"
          id="create-issuance-email"
          :label="'Email' | globalize"
          :error-message="_getErrorMessage('form.email')"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.reference"
          @blur="_touchField('form.reference')"
          id="create-issuance-reference"
          :error-message="_getErrorMessage('form.reference')"
          :label="'Reference' | globalize"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="issuance-form__submit-btn"
        :disabled="$data._isDisabled"
      >
        {{ 'Issue' | globalize }}
      </button>
      <button
        v-ripple
        type="button"
        class="issuance-form__cancel-btn"
        :disabled="$data._isDisabled"
        @click.prevent="cancel"
      >
        {{ 'CANCEL' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SelectFieldUnchained from '@/vue/fields/SelectFieldUnchained'

import { Sdk } from '@/sdk'
// import { base } from '@tokend/js-sdk'

import { required } from '@validators'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'create-issuance-form',
  components: {
    SelectFieldUnchained
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
  validations: {
    form: {
      asset: { required },
      amount: { required },
      email: { required },
      reference: { required }
    }
  },
  computed: {
    ...mapGetters('new-wallet', [
      vuexTypes.wallet
    ]),
    ownedTokensAssets () {
      if (this.userOwnedTokens != null) {
        return this.userOwnedTokens.map(token =>
          `${token.details.name} (${token.code})`)
      }
    },
    availableTokensAmount () {
      if (this.form.asset) {
        const token = this.userOwnedTokens.filter(token =>
          `${token.details.name} (${token.code})` === this.form.asset
        )[0]
        return {
          value: token.availableForIssuance - this.form.amount,
          currency: token.code
        }
      }
    }
  },
  async created () {
    await this.loadUserOwnedTokens()
    if (this.ownedTokensAssets.length > 0) {
      this.form.asset = this.ownedTokensAssets[0]
    }
  },
  methods: {
    async loadUserOwnedTokens () {
      const response = await Sdk.horizon.account.getDetails(
        this[vuexTypes.wallet].accountId
      )
      this.userOwnedTokens = response.data.map(balance =>
        balance.assetDetails).filter(asset =>
        asset.owner === this[vuexTypes.wallet].accountId)
    },
    async submit () {
      return this._isFormValid()
      // const operation =
      //   base.CreateIssuanceRequestBuilder.createIssuanceRequest({
      //     asset: this.form.asset,
      //     amount: this.form.amount.toString(),
      //     receiver: 
      //       'BBKVOTHCUDI4X5MFYNQN7YEAJYY7OPS3HO7J3BBESPQCV23MXW7LLMKR',
      //     reference: this.form.reference,
      //     externalDetails: {}
      //   })
      // await Sdk.horizon.transactions.submitOperations(operation)
    },
    cancel () {
      this.$emit('update:isShown', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './issuance-form';
</style>
