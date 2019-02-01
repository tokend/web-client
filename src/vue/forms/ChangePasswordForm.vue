<template>
  <form
    class="app-form change-password-form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.currentPassword"
          @blur="touchField('form.currentPassword')"
          id="change-password-current"
          type="password"
          :error-message="getFieldErrorMessage('form.currentPassword')"
          :label="'change-password-form.current-password-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.newPassword"
          @blur="touchField('form.newPassword')"
          id="change-password-new"
          type="password"
          :error-message="getFieldErrorMessage('form.newPassword')"
          :label="'change-password-form.new-password-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.confirmPassword"
          @blur="touchField('form.confirmPassword')"
          id="change-password-confirm"
          type="password"
          :error-message="getFieldErrorMessage('form.confirmPassword')"
          :label="'change-password-form.confirm-password-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <div
      v-if="isTotpEnabled"
      class="app__form-row"
    >
      <div class="app__form-field">
        <input-field
          v-model="form.tfaCode"
          @blur="touchField('form.tfaCode')"
          id="change-password-tfa-code"
          :error-message="getFieldErrorMessage('form.tfaCode')"
          :label="'change-password-form.tfa-code-lbl' | globalize"
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
        class="change-password-form__submit-btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'change-password-form.change-password-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { required, requiredIf, password, sameAs } from '@validators'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { Sdk } from '@/sdk'
import { errors } from '@tokend/js-sdk'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'change-password-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      tfaCode: '',
    },
  }),
  validations: {
    form: {
      currentPassword: { required, password },
      newPassword: { required, password },
      confirmPassword: {
        required,
        password,
        sameAsPassword: sameAs(function () { return this.form.newPassword }),
      },
      tfaCode: {
        required: requiredIf(function () { return this.isTotpEnabled }),
      },
    },
  },
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
      isTotpEnabled: vuexTypes.isTotpEnabled,
    }),
  },
  methods: {
    ...mapActions({
      storeWallet: vuexTypes.STORE_WALLET,
    }),
    async submit () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()
      try {
        await Sdk.api.wallets.changePassword(this.form.newPassword)
      } catch (e) {
        if (e instanceof errors.TFARequiredError) {
          await this.retryPasswordChange(e)
        } else {
          ErrorHandler.process(e)
        }
      }
      this.enableForm()
    },
    async retryPasswordChange (tfaError) {
      try {
        await Sdk.api.factors.verifyPasswordFactorAndRetry(tfaError,
          this.form.currentPassword
        )
      } catch (e) {
        if (e instanceof errors.TFARequiredError) {
          try {
            await Sdk.api.factors.verifyTotpFactorAndRetry(e,
              this.form.tfaCode
            )
            await e.retryRequest()
          } catch (e) {
            if (e instanceof errors.TFARequiredError) {
              await Sdk.api.factors.verifyPasswordFactorAndRetry(e,
                this.form.currentPassword
              )
            } else {
              ErrorHandler.process(e)
              return
            }
          }
        } else {
          ErrorHandler.process(e)
          return
        }
      }
      try {
        await this.useNewWallet()
        Bus.success('change-password-form.password-changed-msg')
      } catch (e) {
        ErrorHandler.process(e)
      }
    },
    async useNewWallet () {
      let newWallet
      while (!newWallet) {
        try {
          newWallet = await Sdk.api.wallets.get(
            this.wallet.email,
            this.form.newPassword
          )
        } catch (e) {
          if (e instanceof errors.TFARequiredError) {
            await Sdk.api.factors.verifyTotpFactorAndRetry(e,
              this.form.tfaCode
            )
          } else {
            throw e
          }
        }
      }
      Sdk.sdk.useWallet(newWallet)
      this.storeWallet(newWallet)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.change-password-form__submit-btn {
  @include button-raised();
  max-width: 18rem;
  width: 100%;
}
</style>
