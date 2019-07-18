<template>
  <div class="auth-page">
    <template>
      <h2 class="auth-page__title">
        {{ 'auth-pages.signup-title' | globalize }}
      </h2>

      <div class="auth-page__content">
        <signup-form
          :is-disabled="formMixin.isDisabled"
          :submit-event="'submit'"
          @submit="handleChildFormSubmit"
        />

        <div class="auth-page__tips">
          <div class="auth-page__tip">
            {{ 'auth-pages.have-an-account-question' | globalize }}
            <router-link
              class="auth-page__tip-link"
              :to="vueRoutes.login"
            >
              {{ 'auth-pages.have-an-account-answer' | globalize }}
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SignupForm from '@/vue/forms/SignupForm'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { base } from '@tokend/js-sdk'
import { walletsManager } from '@/api'
import { vueRoutes } from '@/vue-router/routes'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import config from '@/config'

export default {
  name: 'signup',
  components: {
    SignupForm,
  },
  mixins: [FormMixin],
  data: _ => ({
    recoveryKeypair: null,
    password: null,
    email: null,
    vueRoutes,
    isConfirmedSeedCopied: false,
    isRecoverySeedModeEnabled: config.RECOVERY_MODE === 'seed',
  }),
  computed: {
    ...mapGetters({
      walletAccountId: vuexTypes.walletAccountId,
    }),
  },
  methods: {
    ...mapActions({
      storeWallet: vuexTypes.STORE_WALLET,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      loadKyc: vuexTypes.LOAD_KYC,
      loadKvEntries: vuexTypes.LOAD_KV_ENTRIES,
    }),
    handleChildFormSubmit (form) {
      this.email = form.email
      this.password = form.password
      this.recoveryKeypair = base
        .Keypair
        .random()

      this.submit()
    },
    async submit () {
      this.disableForm()
      try {
        const { response, wallet } = await walletsManager.create(
          this.email.toLowerCase(),
          this.password,
          this.recoveryKeypair
        )
        if (response.data.verified) {
          await this.storeWallet(wallet)
          await this.loadAccount(this.walletAccountId)
          await this.loadKyc()
          this.$router.push(vueRoutes.app)
        } else {
          this.$router.push({
            ...vueRoutes.verify,
            params: {
              paramsBase64: btoa(JSON.stringify({
                email: wallet.email.toLowerCase(),
                walletId: wallet.id,
              })),
            },
          })
        }
        this.loadKvEntries()
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
  },
}
</script>

<style lang="scss">
@import './auth-page';

.signup__seed-title.auth-page__title {
  margin-top: -4rem;
}

// Disabled because vue-markdown
/* stylelint-disable selector-nested-pattern */
.signup__seed-disclaimer {
  margin-bottom: 3rem;

  p {
    margin-bottom: 1.6rem;
    font-size: 1.6rem;
  }
}
/* stylelint-enable selector-nested-pattern */

.signup__key-viewer /deep/ .clipboard-field {
  background: $col-clipboard-background-darken;
}
</style>
