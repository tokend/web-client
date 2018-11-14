<template>
  <transition name="fade">
    <div
      class="inactivity-message"
      v-if="isOpened">
      <div class="cover" />

      <div class="inactivity-message__popup material">
        <h2>{{ i18n.inm_session_timeout() }}</h2>
        <p>{{ i18n.inm_session_timeout_descr() }}</p>

        <div class="inactivity-message__buttons btn-outer">
          <button
            class="btn-secondary btn-secondary--danger"
            @click="cancel">
            {{ i18n.lbl_cancel() }}
          </button>

          <button
            class="btn"
            @click="logout">
            {{ i18n.lbl_logout() }} ({{ leftToLogout }})
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
import { i18n } from 'L@/js/i18n'
import { attachEventHandler } from 'L@/js/events/helpers'
import { commonEvents } from 'L@/js/events/common_events'

const popupShowLimit = 15 * 60
const idleDelay = 60
const FORCE_LOGOUT_AT = idleDelay + popupShowLimit
const closedStateDelay = 15 * 60

export default {
  name: 'inactivity-message',
  data () {
    return {
      forceLogoutAt: null,
      showPopupAt: null,
      leftToLogout: null,
      logoutIntervalID: null,
      timeCheckIntervalID: null,
      isOpened: false,
      i18n
    }
  },
  mounted () {
    attachEventHandler(commonEvents.enterAppEvent, this.init)
  },
  methods: {
    // init
    init () {
      this.initTimeChecker()
      this.setInterval()
      this.attachListeners()
      this.reset()
    },
    attachListeners () {
      document.addEventListener('load', this.reset)
      document.addEventListener('mousemove', this.reset)
      document.addEventListener('mousedown', this.reset)
      document.addEventListener('touchstart', this.reset)
      document.addEventListener('click', this.reset)
      document.addEventListener('scroll', this.reset)
      document.addEventListener('keypress', this.reset)
    },
    setInterval () {
      this.logoutIntervalID = window.setInterval(this.tick, 1000)
    },
    reset () {
      if (this.isOpened) return
      this.forceLogoutAt = moment().add(FORCE_LOGOUT_AT, 'seconds')
      this.showPopupAt = moment().add(popupShowLimit, 'seconds')
    },
    // drop
    logout () {
      this.isOpened = false
      this.removeInterval()
      this.destroyListeners()
      this.LOG_OUT()
    },
    removeInterval () {
      window.clearInterval(this.logoutIntervalID)
      window.clearInterval(this.timeCheckIntervalID)
    },
    ...mapActions([
      vuexTypes.LOG_OUT
    ]),
    destroyListeners () {
      document.removeEventListener('load', this.reset)
      document.removeEventListener('mousemove', this.reset)
      document.removeEventListener('mousedown', this.reset)
      document.removeEventListener('touchstart', this.reset)
      document.removeEventListener('click', this.reset)
      document.removeEventListener('scroll', this.reset)
      document.removeEventListener('keypress', this.reset)
    },
    // other
    cancel () {
      this.isOpened = false
      this.reset()
    },
    open () {
      this.isOpened = true
    },
    tick () {
      const now = moment()
      const forceLogoutAt = moment(this.forceLogoutAt)
      const showPopupAt = moment(this.showPopupAt)
      this.leftToLogout = forceLogoutAt.diff(now, 'seconds')
      if (now.isAfter(forceLogoutAt)) {
        this.logout()
        return
      }
      if (now.isAfter(showPopupAt) && !this.isOpened) {
        this.open()
      }
    },
    initTimeChecker () {
      let lastTime = moment()
      this.timeCheckIntervalID = window.setInterval(_ => {
        const now = moment()
        const diff = now.diff(lastTime, 'seconds')
        if (diff > closedStateDelay) {
          this.logout()
        }
        lastTime = now
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';
  @import '~L@scss/mixins';

  .inactivity-message__popup {
    @include center;
    max-width: 550px;
    padding: 30px 40px;
    position: fixed;
    width: 100%;
    z-index: 20;
  }

  .inactivity-message__buttons {
    display: flex;
    justify-content: flex-end;

    button {
      flex: .25;

      &:first-child {
        margin-right: 10px;
      }
    }
  }

</style>
