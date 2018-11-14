<template>
  <md-snackbar
    class="md-accent"
    :md-position="config.position"
    :md-duration="config.isInfinity ? Infinity : config.duration"
    :md-active.sync="isActive"
    md-persistent
  >
    <span>{{ config.msg }}</span>
    <button
      v-ripple
      v-if="config.showButton"
      @click="isActive = false"
      class="app__button-flat snackbar__btn">
      {{ config.btnText }}
    </button>
  </md-snackbar>
</template>

<script>
import { commonEvents } from '../../../js/events/common_events'
import {
  attachEventHandler,
  dispatchAppEvent
} from '../../../js/events/helpers'

const defaults = {
  msg: 'Something happened',
  position: 'center',
  isInfinity: false,
  showButton: true,
  duration: 4000,
  btnText: 'OK',
  type: 'error'
}

export default {
  name: 'snackbar',

  data: () => ({
    isActive: false,
    config: {
      msg: null,
      type: null,
      position: null,
      duration: null,
      btnText: null,
      isInfinity: null,
      showButton: null
    }
  }),

  created () {
    attachEventHandler(commonEvents.showSnackbarEvent, this.open)
    attachEventHandler(commonEvents.hideSnackbarEvent, this.close)
  },

  methods: {
    open (configs) {
      this.close()
      dispatchAppEvent(commonEvents.hideLoaderEvent)
      this.isActive = true
      this.config.msg = configs.msg || defaults.msg
      this.config.type = configs.type || defaults.type
      this.config.position = configs.position || defaults.position
      this.config.duration = configs.duration || defaults.duration
      this.config.btnText = configs.btnText || defaults.btnText
      this.config.isInfinity = configs.isInfinity || defaults.isInfinity
      this.config.showButton = configs.showButton || defaults.showButton
    },
    close () {
      if (!this.isActive) return
      this.isActive = false
      this.config.msg = null
      this.config.type = null
      this.config.position = null
      this.config.duration = null
      this.config.btnText = null
      this.config.isInfinity = null
      this.config.showButton = null
    }
  }
}
</script>

<style scoped lang="scss">
  @import '~L@scss/variables';

  .snackbar__btn {
    color: $col-snackbar-text;

    &:hover {
      background-color: $col-snackbar-text-hover;
    }
  }
</style>
