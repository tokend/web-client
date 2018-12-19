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
            v-ripple
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
import { mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

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
    ...mapActions('new-wallet', {
      storeWallet: vuexTypes.STORE_WALLET
    }),
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
        const { response, wallet } = await Sdk.api.wallets.create(
          this.email,
          this.password,
          this.recoveryKeypair
        )
        if (response.data.verified) {
          await Sdk.api.users.create(wallet.accountId)
          this.storeWallet(wallet)
          await this._doLegacyStuff(wallet)
        } else {
          this.$router.push({
            ...vueRoutes.verify,
            params: {
              paramsBase64: btoa(JSON.stringify({
                email: wallet.email,
                walletId: wallet.id
              }))
            }
          })
        }
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    // TODO: we support old vuex for the legacy components. Remove once
    // the legacy will be completely removed
    async _doLegacyStuff (wallet) {
      await this.$store.dispatch('STORE_USER_DATA_FROM_WALLET', {
        walletId: wallet.id,
        email: wallet.email,
        accountId: wallet.accountId,
        publicKey: wallet.keypair.accountId(),
        seed: wallet.secretSeed
      })

      await Promise.all([
        await this.$store.dispatch('GET_ACCOUNT_DETAILS'),
        await this.$store.dispatch('GET_USER_DETAILS'),
        await this.$store.dispatch('GET_ACCOUNT_BALANCES')
      ])
      this.$store.dispatch('LOG_IN')
      this.$router.push({ name: 'app' })
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
