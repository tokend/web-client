<template>
  <div class="auth-page">
    <template>
      <h2 class="auth-page__title">
        {{ 'auth-pages.signup-general-kyc-title' | globalize }}
      </h2>

      <div class="auth-page__content">
        <general-kyc-form
          is-sign-up
          @submitted="submit"
          @logout="logOut"
        />
      </div>
    </template>
  </div>
</template>

<script>
import GeneralKycForm from '@/vue/forms/GeneralKycForm'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'signup-general-kyc',
  components: {
    GeneralKycForm,
  },

  computed: {
    ...mapGetters([
      vuexTypes.walletAccountId,
    ]),
  },

  methods: {
    ...mapActions({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      logOutAccount: vuexTypes.LOG_OUT,

    }),

    async submit () {
      await this.loadAccount(this.walletAccountId)
      this.$router.push(vueRoutes.app)
    },

    logOut () {
      this.logOutAccount()
      location.reload()
    },
  },
}
</script>

<style lang="scss">
@import './auth-page';

</style>
