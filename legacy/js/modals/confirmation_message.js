import Vue from 'vue'
import store from '../../vuex/index'
import { i18n } from '../i18n/index'
import FormBlockingModalMixin from './flow-blocking-modal.mixin'

const template = `
    <md-dialog-confirm
     :md-active.sync="isOpened"
     :md-title="title"
     :md-content="message"
     :md-confirm-text="confirmText"
     :md-cancel-text="cancelText"
     @md-confirm="confirm"
     @md-cancel="cancel"
    />
`

/**
 * @param {object} [opts]
 * @param opts.title
 * @param opts.message
 * @param opts.confirmText
 * @param opts.cancelText
 * @return {Promise<boolean>}
 */
export function confirmAction (opts = {}) {
  const title = opts.title || i18n.mod_confirm_title()
  const message = opts.message || i18n.mod_confirm_message()
  const confirmText = opts.confirmText || i18n.mod_confirm_confirm_text()
  const cancelText = opts.cancelText || i18n.mod_confirm_cancel_text()

  const container = document.createElement('div')
  document.querySelector('#app').appendChild(container)

  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    const confirmMessage = new Vue({
      mixins: [FormBlockingModalMixin],
      data () {
        return {
          confirmText,
          cancelText,
          message,
          title,
          i18n
        }
      },
      watch: {
        isOpened (val) {
          if (!val) {
            if (!this.isResolved) {
              this.resolvers.resolve(false)
            }
            this.removeElement()
          }
        }
      },
      created () {
        this.setResolvers(resolve, reject)
      },
      methods: {
        confirm () {
          this.resetResolvers()
          this.removeElement()
          return this.resolvers.resolve(true)
        },
        cancel () {
          this.resetResolvers()
          this.removeElement()
          return this.resolvers.resolve(false)
        }
      },
      store,
      template
    })
    confirmMessage.$mount(container)
  })
}
