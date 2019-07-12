<template>
  <form class="app-form auth-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="touchField('form.email')"
          name="kyc-recovery-email"
          :label="'auth-pages.email' | globalize"
          :error-message="getFieldErrorMessage('form.email')"
          :white-autofill="false"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="form.document"
          name="kyc-recovery-document"
          :label="'auth-pages.recovery-document' | globalize"
          :error-message="getFieldErrorMessage('form.document')"
          :file-extensions="['jpg', 'png', 'pdf']"
          :note="'auth-pages.recovery-document-note' | globalize"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="auth-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        {{ 'auth-pages.recover-lbl' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { required, email } from '@validators'
import { Bus } from '@/js/helpers/event-bus'
import { errors } from '@/js/errors'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vueRoutes } from '@/vue-router/routes'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'recovery-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      email: '',
      document: null,
    },
  }),
  validations: {
    form: {
      email: { required, email },
      document: { required },
    },
  },
  computed: {
    ...mapGetters({
      walletAccountId: vuexTypes.walletAccountId,
    }),
  },
  methods: {
    ...mapActions({
      loadWallet: vuexTypes.LOAD_WALLET,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      loadKyc: vuexTypes.LOAD_KYC,
      loadKvEntries: vuexTypes.LOAD_KV_ENTRIES,
    }),
    async submit () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()
      try {
        await this.login()

        Bus.success('auth-pages.recovered')
        this.$router.push(vueRoutes.app)
      } catch (e) {
        switch (e.constructor) {
          case errors.NotFoundError:
            Bus.error('errors.user-doesnt-exist')
            ErrorHandler.processWithoutFeedback(e)
            break
          default:
            ErrorHandler.process(e)
        }
      }
      this.enableForm()
    },

    async login () {
      await this.loadWallet({
        email: this.form.email,
        password: this.form.password,
      })
      await this.loadAccount(this.walletAccountId)
      await this.loadKvEntries()
      await this.loadKyc()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './auth-form';
</style>
