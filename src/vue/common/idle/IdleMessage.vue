<template>
  <div class="idle-wrapper">
    <drawer
      @close-drawer="closeIdleBar"
      :is-shown.sync="isDetailsDrawerShown"
    >
      <template slot="heading">
        Log out
      </template>
      <div>
        <h2 class="idle-heading">
          {{ 'status-message.idle-notification-message' | globalize }}
        </h2>
      </div>
    </drawer>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'idle-message',
  components: {
    Drawer,
  },

  data: _ => ({
    isDetailsDrawerShown: false,
    isIdle: false,
  }),

  onIdle () {
    this.isIdle = true
    this.isDetailsDrawerShown = this.isIdle
    this.clearState()
  },

  computed: {
    ...mapGetters({
      email: vuexTypes.walletEmail,
      typeI: vuexTypes.accountTypeI,
    }),
  },

  methods: {
    ...mapMutations({
      clearState: vuexTypes.CLEAR_STATE,
    }),
    closeIdleBar () {
      location.reload()
    },
  },
}
</script>

<style scoped lang="scss">
.idle-wrapper {
  position: relative;
  z-index: 9999;
}
.idle-heading {
  max-width: 70%;
  margin-top: 2em;
  line-height: 1.5em;
}
</style>
