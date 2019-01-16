<template>
  <div class="auth-page">
    <h2 class="auth-page__title">
      {{ 'auth-pages.almost-done' | globalize }}
    </h2>
    <div class="auth-page__content">
      <div class="auth-page__explanations">
        {{ 'auth-pages.almost-done-details' | globalize({ email }) }}
      </div>
    </div>

    <div class="auth-page__actions">
      <button
        v-ripple
        @click="submit"
        class="auth-page__submit-btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'auth-pages.request-new-email' | globalize }}
      </button>
      <router-link
        v-ripple
        class="auth-page__cancel-btn"
        :to="vueRoutes.login"
        tag="button"
      >
        {{ 'auth-pages.continue' | globalize }}
      </router-link>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { vueRoutes } from '@/vue-router/routes'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { Sdk } from '@/sdk'

export default {
  name: 'verify',
  mixins: [FormMixin],
  props: {
    paramsBase64: {
      type: String,
      required: true,
    },
  },
  data: _ => ({
    walletId: '',
    email: '',
    from: '',
    vueRoutes,
  }),
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === vueRoutes.login.name) {
        Sdk.api.wallets.resendEmail(vm.walletId)
      }
    })
  },
  created () {
    const params = JSON.parse(atob(this.paramsBase64))
    this.email = params.email
    this.walletId = params.walletId
  },
  methods: {
    async submit () {
      this.disableForm()
      try {
        await Sdk.api.wallets.resendEmail(this.walletId)
        Bus.success('auth-pages.email-requested')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './auth-page';
</style>
