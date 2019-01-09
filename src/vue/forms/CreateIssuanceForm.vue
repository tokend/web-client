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
            :disabled="formMixin.isDisabled"
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
// FIXME: move XDR-dependent object imports to sdk
import { ACCOUNT_TYPES } from '@/js/const/xdr.const'
import { errors, base } from '@tokend/js-sdk'
import { required, email, amount } from '@validators'
import { globalize } from '@/vue/filters/globalize'

const EVENTS = {
  closeDrawer: 'close-drawer'
}

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
    accountOwnedTokensCodes: [],
    receiver: null
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
      if (!await this.isFormValid()) return
      this.disableForm()
      try {
        const receiver = await this.loadBalanceIdByEmailAndCode(
          this.request.receiver,
          this.request.code
        )
        if (!receiver) return false
        const operation =
          await base.CreateIssuanceRequestBuilder.createIssuanceRequest({
            asset: this.request.code,
            amount: this.request.amount,
            receiver: receiver,
            reference: this.request.reference,
            externalDetails: {}
          })
        await Sdk.horizon.transactions.submitOperations(operation)
        Bus.success(globalize('create-issuance-form.issuance-succeeded'))
        this.$emit(EVENTS.closeDrawer)
      } catch (error) {
        if (error.constructor === errors.NotFoundError) {
          Bus.error(
            globalize('create-issuance-form.no-balance', {
              asset: this.request.code
            })
          )
          this.enableForm()
          return
        }
        ErrorHandler.process(error)
      }
      this.enableForm()
    },

    async loadBalanceIdByEmailAndCode (email, assetCode) {
      // TODO: add sign
      const account = (await Sdk.api.users.getPage({ email: email })).data[0]
      if (!account) {
        Bus.error(globalize('create-issuance-form.user-does-not-found'))
        return false
      }
      // TODO: add sign
      const balances = (await Sdk.horizon.balances.getPage({
        account: account.id,
        asset: assetCode
      })).data

      if (!balances.length) {
        Bus.error(globalize('create-issuance-form.user-does-not-have-balance'))
        return false
      }

      return balances[0].balanceId
    },

    setTokenCode () {
      this.request.code = this.accountOwnedTokensCodes[0] || null
    },

    getAvailableToIssuance (tokenCode) {
      this.selectedTokenAvailableToIssuance = this.accountOwnedTokens
        .filter(item => item.code === tokenCode)[0]
        .availableForIssuance
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './app-form';
</style>
