<template>
  <form class="login-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="$v.form.email.$touch()"
          :label="globalize('auth-pages.email')"
          :error-message="errorMessage(`form.email`)"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.password"
          @blur="$v.form.password.$touch()"
          :error-message="errorMessage(`form.password`)"
          :label="globalize('auth-pages.password')"
          :type="`password`"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <button
        type="submit"
        class="login-form__submit-btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'auth.log-in' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '../mixins/form.mixin'

import { globalize } from '@/vue/filters/globalize'
import { required } from '@validators'

import { vuexTypes } from '@/vuex'
import { mapActions, mapGetters } from 'vuex'

import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@tokend/js-sdk'

export default {
  name: 'login-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      email: '',
      password: ''
    }
  }),
  validations: {
    form: {
      email: { required },
      password: { required }
    }
  },
  computed: {
    ...mapGetters('new-wallet', [
      vuexTypes.wallet
    ])
  },
  methods: {
    ...mapActions('new-wallet', {
      loadWallet: vuexTypes.LOAD_WALLET
    }),
    globalize,
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        await this.loadWallet(this.form)
        const accountId = this.wallet.accountId
        Sdk.sdk.useWallet(this.wallet)
        if (!await this.isUserExist(accountId)) {
          await Sdk.api.users.create(accountId)
        }
        await this._doLegacyStuff()
      } catch (e) {
        console.error(e)
        ErrorHandler.processUnexpected(e)
      }
      this.enableForm()
    },
    async isUserExist (accountId) {
      try {
        await Sdk.api.users.get(accountId)
        return true
      } catch (e) {
        if (e instanceof errors.NotFoundError) {
          return false
        }
        throw e
      }
    },
    // TODO: we support old vuex for the legacy components. Remove once
    // the legacy will be completely removed
    async _doLegacyStuff () {
      await this.$store.dispatch('PROCESS_USER_WALLET', this.form)
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
@import '~@scss/mixins';
@import '~@scss/variables';

.login-form__submit-btn {
  @include button-raised();

  margin-right: auto;
  margin-bottom: 2 * $point;
  width: 20 * $point;
}

</style>
