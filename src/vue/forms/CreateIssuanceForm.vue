<template>
  <div class="app__page-content-wrp">
    <template v-if="accountTypeI !== ACCOUNT_TYPES.syndicate">
      <h2 class="app__page-heading">
        {{ 'create-issuance-form.not-available-heading' | globalize }}
      </h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ 'create-issuance-form.not-available' | globalize }}
      </p>
      <router-link
        to="/verification"
        tag="button"
        class="app__button-raised">
        {{ 'create-issuance-form.to-verification-btn' | globalize }}
      </router-link>
    </template>

    <template v-else-if="!accountOwnedTokensCodes.length">
      <h2 class="app__page-heading">
        {{ 'create-issuance-form.no-assets-heading' | globalize }}
      </h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ 'create-issuance-form.no-assets' | globalize }}
      </p>
      <router-link
        to="/token-creation"
        tag="button"
        class="app__button-raised">
        {{ 'create-issuance-form.create-token-btn' | globalize }}
      </router-link>
    </template>

    <template v-else>
      <form
        novalidate
        @submit.prevent="submit"
        v-if="formShown">
        <h2 class="app__page-heading">
          {{ 'create-issuance-form.issuance-form' | globalize }}
        </h2>

        <div class="app__form-row">
          <select-field
            :values="accountOwnedTokensCodes"
            v-model="request.code"
            :label="'create-issuance-form.asset-lbl' | globalize"
          />
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              name="amount"
              v-model="request.amount"
              type="number"
              :max="selectedTokenAvailableToIssuance"
              :label="'create-issuance-form.amount-lbl' | globalize"
              @blur="touchField('request.amount')"
              :error-message="getFieldErrorMessage('request.amount')"
            />
            <div class="app__form-field-description">
              <p>
                {{
                  'create-issuance-form.available-to-issuance' | globalize({
                    value: selectedTokenAvailableToIssuance,
                    tokenCode: request.code
                  })
                }}
              </p>
            </div>
          </div>
        </div>

        <div class="app__form-row">
          <input-field
            id="token-name"
            name="issuance email"
            v-model="request.receiver"
            :label="'create-issuance-form.email-lbl' | globalize"
            @blur="touchField('request.receiver')"
            :error-message="getFieldErrorMessage('request.receiver')"
          />
        </div>

        <div class="app__form-row">
          <input-field
            name="reference"
            v-model="request.reference"
            :label="'create-issuance-form.reference-lbl' | globalize"
            @blur="touchField('request.reference')"
            :error-message="getFieldErrorMessage('request.reference')"
          />
        </div>

        <div class="app__form-actions">
          <button
            v-ripple
            type="submit"
            class="app__form-submit-btn">
            {{ 'create-issuance-form.issue-btn' | globalize }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Sdk } from '@/sdk'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
// import { issuanceService } from 'L@/js/services/issuances.service'
// import { accountsService } from 'L@/js/services/accounts.service'
// FIXME: move XDR-dependent object imports to sdk
import { ACCOUNT_TYPES } from '@/js/const/xdr.const'
import { errors } from '@tokend/js-sdk'
import { required, email, amount } from '@validators'
import { globalize } from '@/vue/filters/globalize'

export default {
  name: 'create-issuance-form',
  mixins: [FormMixin],
  data: () => ({
    request: {
      code: ''
    },
    formShown: true,
    unissued: '', // TODO: unissued amount label, exceeding check
    selectedTokenAvailableToIssuance: null,
    ACCOUNT_TYPES,
    accountOwnedTokens: [],
    accountOwnedTokensCodes: []
  }),
  validations: {
    request: {
      amount: {
        required,
        amount
        // TODO: fix it
        // maxValueWrapper: maxValueWrapper(() => {
        //   console.log('this', this)
        //   return +this.selectedTokenAvailableToIssuance
        // })
      },
      receiver: { required, email },
      reference: { required }
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountTypeI,
      vuexTypes.walletEmail,
      vuexTypes.accountId
    ])
  },
  watch: {
    'request.code' (value) {
      if (this.request.code) this.getAvailableToIssuance(value)
    },
    'accountOwnedTokensCodes' (value) {
      this.setTokenCode()
    }
  },
  created () {
    this.getAccountOwnedTokens()
    this.setTokenCode()
    if (this.request.code) {
      this.getAvailableToIssuance(this.request.code)
    }
  },
  methods: {
    async getAccountOwnedTokens () {
      const tokens = (await Sdk.horizon.assets.getAll()).data
      this.accountOwnedTokens = tokens.filter(i => i.owner === this.accountId)
      this.accountOwnedTokensCodes = tokens
        .filter(i => i.owner === this.accountId)
        .map(i => i.code)
    },
    async submit () {
      if (!await this._isFormValid()) return
      this.disable()
      try {
        // const receiver = await this.loadBalanceIdByEmailAndCode(
        //   this.request.receiver,
        //   this.request.code
        // )
      } catch (error) {
        if (error.constructor === errors.NotFoundError) {
          Bus.error(
            globalize('create-issuance-form.no-balance', {
              asset: this.request.code
            })
          )
          this.enable()
          return
        }
        ErrorHandler.process(error)
      }
      this.enable()
    },

    async loadBalanceIdByEmailAndCode (email, assetCode) {
      const accountId =
        (await Sdk.api.users.getPage({ email: email })).data[0].id

      const balanceId = (await Sdk.horizon.balances.getPage({
        account: accountId,
        asset: assetCode
      })).data[0].balanceId

      return balanceId
    },

    setTokenCode () {
      this.request.code = this.accountOwnedTokensCodes[0] || null
    },

    getAvailableToIssuance (tokenCode) {
      this.selectedTokenAvailableToIssuance = this.accountOwnedTokens
        .filter(item => item.code === tokenCode)[0]
        .availableForIssuance
    },
    rerenderForm () {
      this.formShown = false
      this.request = {}
      this.setTokenCode()
      setTimeout(() => (this.formShown = true), 1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './app-form';
</style>
