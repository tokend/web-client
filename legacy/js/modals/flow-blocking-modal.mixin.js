import FormMixin from '../../vue/common/mixins/form.mixin'
import { i18n } from '../i18n/index'
import { ErrorFactory } from '../errors/factory'

export default {
  mixins: [FormMixin],
  data: _ => ({
    form: {
      // form
    },
    resolvers: {
      resolve: () => {},
      reject: () => {}
    },
    isOpened: true,
    isResolved: false,
    i18n
  }),
  methods: {
    setResolvers (resolve, reject) {
      this.resolvers.resolve = resolve
      this.resolvers.reject = reject
    },
    resetResolvers () {
      this.isResolved = true
    },
    close () {
      this.resolvers.reject(ErrorFactory.getOTPCancelledError())
      this.resetResolvers()
      this.isOpened = false
      this.removeElement()
    },
    removeElement () {
      this.isOpened = false
      if (this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  }
}
