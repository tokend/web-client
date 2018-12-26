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

    <template v-else-if="!accountOwnedTokenCodes.length">
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
            :values="accountOwnedTokenCodes"
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
              @blur="_touchField('request.amount')"
              :error-message="_getErrorMessage('request.amount')"
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
            @blur="_touchField('request.receiver')"
            :error-message="_getErrorMessage('request.receiver')"
          />
        </div>

        <div class="app__form-row">
          <input-field
            name="reference"
            v-model="request.reference"
            :label="'create-issuance-form.reference-lbl' | globalize"
            @blur="_touchField('request.reference')"
            :error-message="_getErrorMessage('request.reference')"
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
// FIXME: change it to actual
import { vuexTypes } from 'L@/vuex/types'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { ErrorHandler } from 'L@/js/errors/error_handler'
import { issuanceService } from 'L@/js/services/issuances.service'
import { accountsService } from 'L@/js/services/accounts.service'
// FIXME: move XDR-dependent object imports to sdk
import { ACCOUNT_TYPES } from '@/js/const/xdr.const'
import { errors } from 'L@/js/errors/factory'
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
    ACCOUNT_TYPES
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
      vuexTypes.accountOwnedTokens,
      vuexTypes.accountTypeI
    ]),
    accountOwnedTokenCodes () {
      return this.accountOwnedTokens.map(item => item.asset)
    }
  },
  watch: {
    'request.code' (value) {
      if (this.request.code) this.getAvailableToIssuance(value)
    }
  },
  created () {
    this.setTokenCode()
    if (this.request.code) {
      this.getAvailableToIssuance(this.request.code)
    }
  },
  methods: {
    async submit () {
      if (!await this._isFormValid()) return
      this.disable()
      try {
        const receiver = await accountsService.loadBalanceIdByEmail(
          this.request.receiver,
          this.request.code
        )
        await issuanceService.createIssuanceRequest({
          token: this.request.code,
          amount: this.request.amount,
          receiver: receiver,
          reference: this.request.reference,
          externalDetails: {}
        })
        EventDispatcher.dispatchShowSuccessEvent(
          globalize('create-issuance-form.submit-success')
        )
        this.rerenderForm()
      } catch (error) {
        if (error.constructor === errors.NotFoundError) {
          EventDispatcher.dispatchShowErrorEvent(
            globalize('create-issuance-form.no-balance', {
              asset: this.request.code
            })
          )
          this.enable()
          return
        }
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },

    setTokenCode () {
      this.request.code = this.accountOwnedTokenCodes[0] || null
    },

    getAvailableToIssuance (tokenCode) {
      this.selectedTokenAvailableToIssuance = this.accountOwnedTokens
        .filter(item => item.asset === tokenCode)[0]
        .asset_details.available_for_issuance
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
