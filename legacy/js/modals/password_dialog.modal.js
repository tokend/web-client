import Vue from 'vue'
import store from '../../vuex/index'
import FlowBlockingModalMixin from './flow-blocking-modal.mixin'

import { EventDispatcher } from '../events/event_dispatcher'
import { factorsService } from '../services/factors.service'
import { AuthStateHelper } from '../../vuex/helpers/auth.helper'
import { WalletHelper } from '../helpers/wallet.helper'
import { i18n } from '../i18n/index'
import { ErrorFactory } from '../errors/factory'

const template = `
  <form novalidate>
   <md-dialog :md-active.sync="isOpened" :md-fullscreen="false" @md-closed="isOpened = false">
    <md-dialog-title>{{ i18n.mod_pwd_required() }}</md-dialog-title>
    <div class="app__dialog-inner">
      <input-field
        v-model="form.password"
        v-validate="'required'"
         id="signup-recovery-seed"
         type="password"
         name="password"
        :errorMessage="errorMessage('password')"
        :label="i18n.lbl_pwd()"
        :togglePassword="true"
      />
    </div>

    <md-dialog-actions>
      <button v-ripple @click="close" class="app__button-flat"> {{ i18n.lbl_cancel() }} </button>
      <button v-ripple @click="submit" class="app__button-flat"> {{ i18n.lbl_ok() }} </button>
    </md-dialog-actions>

   </md-dialog>
  </form>
 `

/**
 *
 * @param onSubmit
 * @param opts
 * @param opts.salt
 * @param opts.kdf
 * @param opts.token
 * @param opts.keychainData
 * @param opts.factorId
 * @param opts.email
 *
 * @return {Promise<*>}
 */
export function createPasswordDialog (onSubmit, opts) {
  const keychainData = opts.keychainData
  const factorId = opts.factorId
  const token = opts.token
  const email = opts.email
  const salt = opts.salt
  const kdf = opts.kdf

  const passwordModal = document.createElement('div')
  document.querySelector('#app').appendChild(passwordModal)

  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    const TFADialog = new Vue({
      mixins: [FlowBlockingModalMixin],
      data () {
        return {
          form: {
            password: ''
          }
        }
      },
      // TODO: this watcher doesn't work if placed in mixin, resolve why and
      //       remove code duplication from here and tfa modal
      watch: {
        isOpened (val) {
          if (!val) {
            if (!this.isResolved) {
              this.resolvers.reject(ErrorFactory.getOTPCancelledError())
            }
            this.removeElement()
          }
        }
      },
      created () {
        this.setResolvers(resolve, reject)
      },
      methods: {
        async submit () {
          if (!await this.isValid()) return
          if (!await AuthStateHelper.isPasswordCorrect(this.form.password)) {
            EventDispatcher.dispatchShowErrorEvent(i18n.mod_pwd_wrond())
          }
          const { walletKey } = WalletHelper.calculateWalletParams(
            this.form.password,
            email,
            salt,
            kdf
          )
          const signedToken = WalletHelper.signToken(
            token,
            keychainData,
            walletKey
          )
          this.disable()
          try {
            await factorsService.verifyFactor(factorId, token, signedToken)
          } catch (error) {
            console.error(error)
            EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
            return
          }

          this.resetResolvers()
          this.enable()
          this.removeElement()

          try {
            await this.resolvers.resolve(await onSubmit())
          } catch (error) {
            return this.resolvers.reject(error)
          }
        }
      },
      store,
      template
    })
    TFADialog.$mount(passwordModal)
  })
}
