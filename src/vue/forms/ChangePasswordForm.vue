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
          name="change-password-current-password"
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
          name="change-password-new-password"
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
          name="change-password-new-password-confirm"
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
import { Api } from '@/api'
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
      accountId: vuexTypes.accountId,
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
          // To change password we should verify password factor first.
          // To do that we need to provide TFARequiredError instance.
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
        // If 2FA is enabled we should verify TOTP factor
        // (using TFARequiredError instance).
        if (e instanceof errors.TFARequiredError) {
          try {
            await Sdk.api.factors.verifyTotpFactorAndRetry(e,
              this.form.tfaCode
            )
          } catch (e) {
            // FIXME: We need to verify password factor again after
            // verifying 2FA factor.
            if (e instanceof errors.TFARequiredError) {
              await Sdk.api.factors.verifyPasswordFactorAndRetry(e,
                this.form.currentPassword
              )
            } else {
              // If verifyTotpFactor threw an error different from
              // TFARequiredError, there must be wrong 2FA code provided.
              ErrorHandler.process(e, 'change-password-form.wrong-code-err')
              return
            }
          }
        } else {
          // If verifyPasswordFactor threw an error different from
          // TFARequiredError, there must be wrong password provided.
          ErrorHandler.process(e, 'change-password-form.wrong-password-err')
          return
        }
      }

      // Load new wallet after successful password change.
      try {
        await this.useNewWallet()
        Bus.success('change-password-form.password-changed-msg')
      } catch (e) {
        ErrorHandler.process(e)
      }
    },

    async useNewWallet () {
      let newWallet
      try {
        newWallet = await Sdk.api.wallets.get(
          this.wallet.email,
          this.form.newPassword
        )
      } catch (e) {
        // If 2FA is enabled we should verify TOTP factor
        // to get a user's wallet.
        if (e instanceof errors.TFARequiredError) {
          await Sdk.api.factors.verifyTotpFactor(e,
            this.form.tfaCode
          )
          newWallet = await Sdk.api.wallets.get(
            this.wallet.email,
            this.form.newPassword
          )
        } else {
          throw e
        }
      }
      Api.useWallet(newWallet)
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
