import Vue from 'vue'
import InputField from '../../vue/common/fields/InputField'
import { i18n } from '../i18n/index'

const template = `
<form novalidate>
  <md-dialog class="app__dialog"
            :md-active="opened"
            :md-close-on-esc="false"
            :md-click-outside-to-close="false">

     <md-dialog-title>{{ i18n.mod_save_seed() }}</md-dialog-title>

     <div class="app__dialog-inner">
       <p>{{ i18n.mod_why_save_seed() }}</p>

       <input-field id="signup-recovery-seed"
                    type="password"
                    name="recovery-seed"
                   :label="i18n.lbl_seed()"
                   :readonly="true"
                   :togglePassword="true"
                   :value="form.seed"
       />

       <p>{{ i18n.mod_validate_seed_how() }}</p>

       <input-field id="signup-provide-seed"
                    type="password"
                    name="recovery-seed"
                   :label="i18n.lbl_validate_seed()"
                   :togglePassword="true"
                   :errorMessage="isSeedValid ? '' : 'Provided seed does not match with generated one'"
                  v-model.trim="form.provideSeed"
       />
     </div>

     <md-dialog-actions>
      <button v-ripple @click="submit" class="app__button-flat"> {{ i18n.lbl_ok() }} </button>
     </md-dialog-actions>
   </md-dialog>
 </form>
`

export function showRememberSeedMessage (seed) {
  const seedModal = document.createElement('div')
  document.querySelector('#app').appendChild(seedModal)

  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve) => {
    const messageEl = new Vue({
      components: { InputField },
      data () {
        return {
          form: {
            provideSeed: '',
            seed
          },
          opened: true,
          i18n
        }
      },
      computed: {
        isSeedValid () {
          return this.form.seed === this.form.provideSeed
        }
      },

      methods: {
        close () {
          if (!this.isSeedValid) return
          this.opened = false
          this.$el.parentNode.removeChild(this.$el)
        },
        async submit () {
          if (!this.isSeedValid) return
          this.close()
          return resolve(true)
        }
      },
      template
    })
    messageEl.$mount(seedModal)
  })
}
