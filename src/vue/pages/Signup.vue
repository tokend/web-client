<template>
  <div class="auth-page">
    <h2 class="auth-page__title">
      {{
        recoveryKeypair
          ? 'auth-pages.save-recovery-seed-warning'
          : 'auth-pages.get-started'
          | globalize
      }}
    </h2>

    <div class="auth-page__content">
      <template v-if="!recoveryKeypair">
        <signup-form
          :submit-event="'submit'"
          @submit="handleChildFormSubmit"
        />

        <div class="auth-page__tips">
          <div class="auth-page__tip">
            {{ 'auth-pages.have-an-account-question' | globalize }}
            <router-link class="auth-page__tip-link" :to="vueRoutes.login">
              {{ 'auth-pages.have-an-account-answer' | globalize }}
            </router-link>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="signup__seed-wrp">
          <div class="signup__seed-explanations">
            <p class="signup__seed-explanation-text">
              Seed is used to recover account in case of password loss. If you
              lose your password and seed, you will <b>never</b> access your
              account.
            </p>
            <p class="signup__seed-explanation-text">
              <b>We do not know your seed</b> and it will never be shown again!
            </p>
          </div>

          <key-viewer
            :value="recoveryKeypair.secret()"
            :label="'auth-pages.recovery-seed' | globalize"
          />

          <div class="signup__tick-field-container">
            <tick-field
              v-model="isSeedCopied"
              :cb-value="false"
              :required="true"
              :disabled="formMixin.isDisabled"
            >
              {{ 'auth-pages.save-recovery-seed-confirmation' | globalize }}
            </tick-field>
          </div>

          <div class="signup__actions">
            <button
              v-ripple
              @click="submit"
              :disabled="!isSeedCopied"
              class="auth-page__submit-btn"
            >
              {{ 'auth-pages.continue' | globalize }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SignupForm from '../forms/SignupForm'
import KeyViewer from '../common/KeyViewer'
import TickField from '@/vue/fields/TickField'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { base } from '@tokend/js-sdk'
import { Sdk } from '@/sdk'
import { Api } from '@/api'
import { vueRoutes } from '@/vue-router/routes'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'signup',
  components: {
    SignupForm,
    KeyViewer,
    TickField,
  },
  mixins: [FormMixin],
  data: _ => ({
    recoveryKeypair: null,
    password: null,
    email: null,
    vueRoutes,
    isSeedCopied: false,
  }),
  computed: {
    ...mapGetters({
      storedWallet: vuexTypes.wallet,
    }),
  },
  methods: {
    ...mapActions({
      storeWallet: vuexTypes.STORE_WALLET,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      loadKyc: vuexTypes.LOAD_KYC,
      loadKvEntriesAccountRoleIds: vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS,
    }),
    handleChildFormSubmit (form) {
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
          this.email.toLowerCase(),
          this.password,
          this.recoveryKeypair
        )
        if (response.data.verified) {
          Sdk.sdk.useWallet(wallet)
          Api.useWallet(wallet)
          this.storeWallet(wallet)
          await this.loadAccount(this.storedWallet.accountId)
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
        this.loadKvEntriesAccountRoleIds()
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

.signup__explanations {
  margin-bottom: 3rem;
}
.signup__seed-explanation-text {
  margin-bottom: 1rem;
  font-size: 1.6rem;
}
.signup__actions {
  margin-top: 2rem;
  text-align: center;
}
.signup__tick-field-container {
  padding-top: 2.2rem;
}
</style>
