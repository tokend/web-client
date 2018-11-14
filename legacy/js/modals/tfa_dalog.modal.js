import Vue from 'vue'
import store from '../../vuex/index'
import FlowBlockingModalMixin from './flow-blocking-modal.mixin'

import { ErrorFactory, errors } from '../errors/factory'
import { EventDispatcher } from '../events/event_dispatcher'
import { factorsService } from '../services/factors.service'
import { i18n } from '../i18n/index'

const template = `
  <form novalidate>
   <md-dialog :md-fullscreen="false" :md-active.sync="isOpened">
    <md-dialog-title>{{ i18n.mod_tfa_required() }}</md-dialog-title>

    <div class="app__dialog-inner">
      <input-field
       v-model="form.code"
       v-validate="'required'"
         id="modal-tfa-code"
         name="code"
        :errorMessage="errorMessage('code')"
        :label="i18n.lbl_tfa_code()"
      />
    </div>

    <md-dialog-actions>
      <button v-ripple @click="close" class="app__button-flat">{{ i18n.lbl_cancel() }}</button>
      <button v-ripple @click="submit" class="app__button-flat" :disabled="isPending">{{ i18n.lbl_submit() }}</button>
    </md-dialog-actions>

   </md-dialog>
  </form>
 `

export function createTfaDialog (onSubmit, { factorId, token }, walletId) {
  const tfaModal = document.createElement('div')
  document.querySelector('#app').appendChild(tfaModal)
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    const TFADialog = new Vue({
      mixins: [FlowBlockingModalMixin],
      data: _ => ({
        form: {
          code: ''
        }
      }),
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
          this.disable()

          try {
            await factorsService.verifyFactor(
              factorId,
              token,
              this.form.code,
              walletId
            )
          } catch (error) {
            if (error instanceof errors.TFAWrongCodeError) {
              EventDispatcher.dispatchShowErrorEvent(i18n.auth_tfa_wrong_code())
              this.enable()
              return
            }
            return this.resolvers.reject(error)
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
    TFADialog.$mount(tfaModal)
  })
}
