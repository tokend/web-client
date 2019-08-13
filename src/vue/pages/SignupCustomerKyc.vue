<template>
  <div class="auth-page">
    <template>
      <h2 class="auth-page__title">
        {{ 'auth-pages.signup-customer-kyc-title' | globalize }}
      </h2>

      <div class="auth-page__content">
        <customer-kyc-form
          :is-disabled="formMixin.isDisabled"
          :submit-event="'submit'"
          @submit="handleChildFormSubmit"
        />
      </div>
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import CustomerKycForm from '@/vue/forms/CustomerKycForm'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { base } from '@tokend/js-sdk'
import { walletsManager } from '@/api'
import { vueRoutes } from '@/vue-router/routes'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'signup-customer-kyc',
  components: {
    CustomerKycForm,
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

</style>
