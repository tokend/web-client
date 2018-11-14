import Vue from 'vue'
import store from '../../vuex/index'
import { i18n } from '../i18n/index'
import FormBlockingModalMixin from './flow-blocking-modal.mixin'

const template = `
    <md-dialog-alert
    :md-active.sync="isOpened"
    :md-title="title"
    :md-content="message" />
`

/**
 * @param {object} [opts]
 * @param opts.title
 * @param opts.message
 * @return {Promise<boolean>}
 */
export function showAlert (opts = {}) {
  const title = opts.title
  const message = opts.message

  const container = document.createElement('div')
  document.querySelector('#app').appendChild(container)

  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    const alertMessage = new Vue({
      mixins: [FormBlockingModalMixin],
      data () {
        return {
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
      store,
      template
    })
    alertMessage.$mount(container)
  })
}
