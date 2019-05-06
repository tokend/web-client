<template>
  <div class="auth-page">
    <template v-if="!recoveryKeypair">
      <h2 class="auth-page__title">
        {{ 'auth-pages.signup-title' | globalize }}
      </h2>

      <div class="auth-page__content">
        <signup-form
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

    <template v-else>
      <h2 class="auth-page__title signup__seed-title">
        {{ 'auth-pages.save-recovery-seed-title' | globalize }}
      </h2>

      <div class="auth-page__content">
        <div class="signup__seed-wrp">
          <div class="signup__seed-disclaimer">
            <vue-markdown
              :source="'auth-pages.save-recovery-seed-explanation' | globalize"
            />
          </div>

          <key-viewer
            class="signup__key-viewer"
            :value="recoveryKeypair.secret()"
            :label="'auth-pages.recovery-seed' | globalize"
          />

          <div class="app__form-row">
            <tick-field
              v-model="isConfirmedSeedCopied"
              :cb-value="false"
              :required="true"
              :disabled="formMixin.isDisabled"
            >
              {{ 'auth-pages.save-recovery-seed-confirmation' | globalize }}
            </tick-field>
          </div>

          <div class="app__form-actions">
            <button
              v-ripple
              @click="submit"
              :disabled="!isConfirmedSeedCopied || formMixin.isDisabled"
              class="auth-page__submit-btn app__button-raised"
            >
              {{ 'auth-pages.continue' | globalize }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SignupForm from '@/vue/forms/SignupForm'
import KeyViewer from '@/vue/common/KeyViewer'
import TickField from '@/vue/fields/TickField'
import VueMarkdown from 'vue-markdown'
import config from '@/config'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { base } from '@tokend/js-sdk'
import { Sdk } from '@/sdk'
import { initApi } from '@/api'
import { vueRoutes } from '@/vue-router/routes'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'signup',
  components: {
    SignupForm,
    KeyViewer,
    TickField,
    VueMarkdown,
  },
  mixins: [FormMixin],
  data: _ => ({
    recoveryKeypair: null,
    password: null,
    email: null,
    vueRoutes,
    isConfirmedSeedCopied: false,
  }),
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
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
          initApi(wallet, config.HORIZON_SERVER)
          this.storeWallet(wallet)
          await this.loadAccount(this.accountId)
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
@import "./auth-page";

.signup__seed-title.auth-page__title {
  margin-top: -4rem;
}

.signup__seed-disclaimer {
  margin-bottom: 3rem;

  p {
    margin-bottom: 1.6rem;
    font-size: 1.6rem;
  }
}

.signup__key-viewer /deep/ .clipboard-field {
  background: $col-clipboard-background-darken;
}
</style>
