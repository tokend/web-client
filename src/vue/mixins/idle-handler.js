import { mapMutations, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'

// docs of idle-vue:
// https://www.npmjs.com/package/idle-vue

export default {
  onIdle () {
    if (!this.isLoggedIn || !document.hasFocus()) {
      return
    }

    this.clearState()
    this.$router.push({
      // preserve the current route name so router guards will remember the
      // route and Login form will redirect the user to the previous route
      // after next successful login
      name: this.$route.name,
      query: { isIdle: true },
    })
    this.reloadApp()
  },

  computed: {
    ...mapGetters({
      isLoggedIn: vuexTypes.isLoggedIn,
    }),
  },

  methods: {
    ...mapMutations({
      clearState: vuexTypes.CLEAR_STATE,
    }),

    reloadApp () {
      // wrapped for testing purposes
      return location.reload()
    },
  },
}
