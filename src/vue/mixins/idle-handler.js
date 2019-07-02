import { mapMutations, mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'

// docs of idle-vue:
// https://www.npmjs.com/package/idle-vue

const UPDATE_SESSION_INTERVAL = 1000 * 60 * 2

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

  data: () => ({
    sessionKeeperInterval: '',
  }),

  computed: {
    ...mapGetters({
      isLoggedIn: vuexTypes.isLoggedIn,
    }),
  },

  methods: {
    ...mapActions({
      updateSession: vuexTypes.UPDATE_SESSION,
    }),
    ...mapMutations({
      clearState: vuexTypes.CLEAR_STATE,
    }),

    reloadApp () {
      // wrapped for testing purposes
      return location.reload()
    },

    updateSessionWithInterval () {
      if (document.hasFocus()) {
        this.setSessionKeeperInterval()
      }
      window.addEventListener('focus', () => {
        this.keepSession()
        this.setSessionKeeperInterval()
      })
      window.addEventListener('blur', () => {
        clearInterval(this.sessionKeeperInterval)
      })
    },

    async keepSession () {
      try {
        await this.updateSession()
      } catch (error) {
        this.clearState()
        this.$router.push({
          name: this.$route.name,
          query: { isSessionExpired: true },
        })
        this.reloadApp()
      }
    },

    setSessionKeeperInterval () {
      this.sessionKeeperInterval = setInterval(async () => {
        await this.keepSession()
      }, UPDATE_SESSION_INTERVAL)
    },
  },

  watch: {
    isLoggedIn (value) {
      if (value) {
        this.updateSessionWithInterval()
      }
    },

  },
}
