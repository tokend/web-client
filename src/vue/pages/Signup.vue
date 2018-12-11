<template>
  <div class="auth-page">
    <h2 class="auth-page__title">
      {{
        recoveryKeypair
          ? 'auth-pages.save-recovery-seed'
          : 'auth-pages.get-started'
            | globalize
      }}
    </h2>

    <div class="auth-page__content">
      <signup-form
        v-if="!recoveryKeypair"
        :submit-event="'submit'"
        @submit="handleFormSubmit"
      />

      <div class="signup__seed-wrp" v-else>
        <p class="signup__seed-explanations">
          {{ 'auth-pages.save-recovery-seed-details' | globalize }}
        </p>

        <key-viewer :value="recoveryKeypair.secret()" />

        <div class="signup__actions">
          <button
            @click="submit"
            :disabled="formMixin.isDisabled"
            class="auth-page__submit-btn"
          >
            {{ 'auth-pages.continue' | globalize }}
          </button>
        </div>
      </div>
    </div>

    <div class="auth-page__tips">
      <div class="auth-page__tip">
        {{ 'auth-pages.have-an-account-question' | globalize }}
        <router-link class="auth-page__tip-link" :to="vueRoutes.login">
          {{ 'auth-pages.have-an-account-answer' | globalize }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import FormMixin from '../mixins/form.mixin'

import SignupForm from '../forms/SignupForm'
import KeyViewer from '../common/KeyViewer'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { base } from '@tokend/js-sdk'
import { Sdk } from '@/sdk'
import { vueRoutes } from '@/vue-router'

export default {
  name: 'signup',
  components: {
    SignupForm,
    KeyViewer
  },
  mixins: [FormMixin],
  data: _ => ({
    recoveryKeypair: null,
    password: null,
    email: null,
    vueRoutes
  }),
  methods: {
    handleFormSubmit (form) {
      this.email = form.email
      this.password = form.password
      this.recoveryKeypair = base
        .Keypair
        .random()
    },
    async submit () {
      this.disableForm()
      try {
        await Sdk.api.wallets.create(
          this.email,
          this.password,
          this.recoveryKeypair
        )
        this.$router.push('/auth-done')
      } catch (e) {
        console.error(e)
        ErrorHandler.processUnexpected(e)
      }
      this.enableForm()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './auth-page';

.signup__seed-wrp {
  max-width: 51 * $point;
}

.signup__seed-explanations {
  margin-bottom: 2 * $point;
}

.signup__actions {
  margin-top: 2 * $point;
  text-align: center;
}

</style>
