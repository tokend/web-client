<template>
  <md-snackbar
    class="md-accent"
    :md-position="config.position"
    :md-duration="Infinity"
    :md-active.sync="isActive"
    md-persistent
  >
    <span>{{ config.msg }}</span>
    <button
      v-ripple
      @click="isActive = false"
      v-if="config.showButton"
      class="app__button-flat">
      {{ config.btnText }}
    </button>
  </md-snackbar>
</template>

<script>
import { commonEvents } from '../../../js/events/common_events'
import { attachEventHandler } from '../../../js/events/helpers'

export default {
  name: 'snackbar',

  data: () => ({
    isActive: false,
    config: {
      msg: 'Processing...',
      position: 'left',
      isInfinity: true,
      showButton: false,
      btnText: '',
      type: 'success'
    }
  }),

  created () {
    attachEventHandler(commonEvents.showLoaderEvent, this.open)
    attachEventHandler(commonEvents.hideLoaderEvent, this.close)
  },

  methods: {
    open () {
      this.close()
      this.isActive = true
    },
    close () {
      this.isActive = false
    }
  }
}
</script>

<style scoped>

</style>
