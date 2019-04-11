import { mapMutations } from 'vuex'
import { vuexTypes } from '@/vuex/types'

export default {
  onIdle () {
    if (!this.isLoggedIn) {
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
    location.reload()
  },

  computed: {
    isLoggedIn: vuexTypes.isLoggedIn,
  },

  methods: {
    ...mapMutations({
      clearState: vuexTypes.CLEAR_STATE,
    }),
  },
}
