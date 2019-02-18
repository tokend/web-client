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
  props: {
    isIdle: { type: Boolean, default: false },
  },
  data: _ => ({
    isDetailsDrawerShown: false,
  }),
  computed: {
    ...mapGetters({
      email: vuexTypes.walletEmail,
      typeI: vuexTypes.accountTypeI,
    }),
  },
  watch: {
    isIdle: function () {
      if (this.isIdle) {
        this.isDetailsDrawerShown = this.isIdle
        this.clearState()
      }
    },
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
