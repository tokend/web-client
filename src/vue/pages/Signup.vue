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
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { base, Signer } from '@tokend/js-sdk'
import { walletsManager, api } from '@/api'
import { vueRoutes } from '@/vue-router/routes'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { keyValues } from '@/key-values'

export default {
  name: 'signup',
  components: {
    SignupForm,
  },
  mixins: [FormMixin],
  data: _ => ({
    recoveryKeypair: null,
    password: null,
    email: '',
    vueRoutes,
    isConfirmedSeedCopied: false,
    inviteVerificationInfo: {},
  }),
  computed: {
    ...mapGetters({
      walletAccountId: vuexTypes.walletAccountId,
    }),

    isInviteVerificationInfoExists () {
      return !isEmpty(this.inviteVerificationInfo)
    },

    isCurrentAndVerificationEmailsIdentical () {
      return this.email === this.inviteVerificationInfo.email
    },
  },

  created () {
    this.inviteVerificationInfo = this.$route.params.inviteVerificationInfo
  },

  methods: {
    ...mapActions({
      storeWallet: vuexTypes.STORE_WALLET,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      loadKyc: vuexTypes.LOAD_KYC,
      loadKvEntries: vuexTypes.LOAD_KV_ENTRIES,
      loadWallet: vuexTypes.LOAD_WALLET,
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
        const { isVerified, wallet } = await this.createWallet()
        if (isVerified) {
          await this.storeWallet(wallet)
          await this.loadAccount(this.walletAccountId)
          await this.loadKyc()
          await this.$router.push(vueRoutes.app)
        }

        const shouldVerifyEmail =
          this.isInviteVerificationInfoExists &&
          this.isCurrentAndVerificationEmailsIdentical
        if (shouldVerifyEmail) {
          const encodedVerificationInfo = btoa(JSON.stringify({
            meta: {
              wallet_id: wallet.id,
              token: this.inviteVerificationInfo.token,
            },
          }))
          await walletsManager.verifyEmail(encodedVerificationInfo)
          // temporary fix when wallet unverified we don't get info about
          // session
          await this.loadWallet({
            email: this.email.toLowerCase(),
            password: this.password,
          })
          await this.loadAccount(this.walletAccountId)
          await this.loadKyc()
          await this.$router.push(vueRoutes.app)
        } else {
          await this.$router.push({
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

    async createWallet () {
      const signers = []
      const recoverySigner = new Signer({
        id: this.recoveryKeypair.accountId(),
        roleId: 1,
        weight: 1000,
        identity: 1,
      })
      signers.push(recoverySigner)

      if (keyValues.bridgesEnabled > 0) {
        const issuanceSigner = new Signer({
          id: api.networkDetails.masterAccountId,
          roleId: keyValues.issuanceSignerRoleId,
          weight: 1000,
          identity: 1,
        })
        signers.push(issuanceSigner)
      }

      const { response, wallet } = await walletsManager.createWithSigners(
        this.email.toLowerCase(),
        this.password,
        signers,
      )

      const isVerified = Boolean(get(response, 'data.verified'))
      return {
        isVerified,
        wallet,
      }
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
