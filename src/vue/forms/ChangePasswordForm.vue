<template>
  <form
    class="app-form auth-form"
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
          id="cahge-password-confirm"
          type="password"
          :error-message="getFieldErrorMessage('form.confirmPassword')"
          :label="'change-password-form.confirm-password-lbl' | globalize"
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

import { required, password, sameAs } from '@validators'

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
    },
  },
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
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
      if (await this.isPasswordCorrect()) {
        try {
          await Sdk.api.wallets.changePassword(this.form.newPassword)
        } catch (e) {
          if (e instanceof errors.TFARequiredError) {
            await this.retryPasswordChange(e)
          } else {
            ErrorHandler.process(e)
          }
        }
      } else {
        Bus.error('change-password-form.wrong-password-err')
      }
      this.enableForm()
    },
    async isPasswordCorrect () {
      try {
        const wallet = await Sdk.api.wallets.get(this.wallet.email,
          this.form.currentPassword
        )
        return wallet.id === this.wallet.id
      } catch (e) {
        if (e instanceof errors.NotFoundError) {
          return false
        } else {
          ErrorHandler.process(e)
        }
      }
    },
    async retryPasswordChange (tfaError) {
      try {
        await Sdk.api.factors.verifyPasswordFactorAndRetry(tfaError,
          this.form.currentPassword
        )
        await this.useNewWallet()
        Bus.success('change-password-form.password-changed-msg')
      } catch (e) {
        ErrorHandler.process(e)
      }
    },
    async useNewWallet () {
      const newWallet = await Sdk.api.wallets.get(
        this.wallet.email,
        this.form.newPassword
      )
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
