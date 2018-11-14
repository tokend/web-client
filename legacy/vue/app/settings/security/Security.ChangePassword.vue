<template>
  <div class="change-password">
    <md-dialog-title>{{ i18n.set_change_password() }}</md-dialog-title>
    <form
      novalidate
      class="change-password"
      @submit.prevent="submit"
    >
      <div class="app__dialog-inner">
        <input-field
          v-model="form.currentPassword"
          id="settings-current-password"
          name="current-password"
          type="password"
          :toggle-password="true"
          :label="i18n.lbl_current_password()"
          :readonly="isPending"
          :error-message="errorMessage('current password')"
          v-validate="'required|min:6'"
        />
        <input-field
          v-model="form.password"
          id="settings-password"
          name="password"
          type="password"
          :toggle-password="true"
          :label="i18n.lbl_new_pwd()"
          :error-message="errorMessage('password')"
          :readonly="isPending"
          v-validate="'required|min:6'"
        />
        <input-field
          v-model="form.confirmPassword"
          id="settings-confirm-password"
          name="confirm-password"
          type="password"
          :label="i18n.lbl_pwd_confirm()"
          v-validate="'required'"
          :readonly="isPending"
          :error-message="pwdUnconfirmedMessage"
        />
      </div>

      <md-dialog-actions class="md-layout md-alignment-center-right">
        <button
          v-ripple
          type="submit"
          class="app__button-flat"
          :disabled="isPending"
        >
          {{ i18n.lbl_submit() }}
        </button>
      </md-dialog-actions>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { EventDispatcher } from '../../../../js/events/event_dispatcher'
import { authService } from '../../../../js/services/auth.service'
import { vuexTypes } from '../../../../vuex/types'
import { i18n } from '../../../../js/i18n/index'
import { AuthStateHelper } from 'L@/vuex/helpers/auth.helper'

import Form from '../../../common/mixins/form.mixin'

export default {
  name: 'change-password',
  mixins: [Form],
  data: _ => ({
    isFormOpened: false,
    i18n,
    form: {
      password: '',
      confirmPassword: '',
      currentPassword: ''
    }
  }),
  computed: {
    ...mapGetters([
      vuexTypes.userEmail,
      vuexTypes.accountId
    ]),
    pwdUnconfirmedMessage () {
      return (this.form.password && this.form.confirmPassword &&
        this.form.confirmPassword !== this.form.password)
        ? i18n.set_pwd_do_not_match() : ''
    }
  },
  watch: {
    isFormOpened () {
      this.form.password = ''
      this.form.confirmPassword = ''
    }
  },
  methods: {
    ...mapActions({
      storeNewData: vuexTypes.STORE_USER_DATA_FROM_WALLET
    }),
    async submit () {
      if (!await this.isValid()) return
      if (!await AuthStateHelper.isPasswordCorrect(this.form.currentPassword)) {
        EventDispatcher.dispatchShowErrorEvent(i18n.mod_pwd_wrond())
        return
      }
      if (this.pwdUnconfirmedMessage) return
      this.disable()
      try {
        const newKeys = await authService.changePassword({
          email: this.userEmail,
          newPassword: this.form.password,
          currentPassword: this.form.currentPassword
        })
        EventDispatcher.dispatchShowSuccessEvent(i18n.set_pwd_changed())
        this.isFormOpened = false
        this.storeNewData({
          publicKey: newKeys.newPublicKey,
          walletId: newKeys.newWalletId,
          seed: newKeys.newSeed,
          accountId: this.accountId,
          email: this.userEmail
        })
      } catch (error) {
        console.error(error)
        if (error.showBanner) {
          error.showBanner(i18n.unexpected_error())
          this.enable()
          return
        }
        EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
      }
      this.enable()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "settings";
.md-dialog {
  width: 36rem;
}
</style>
