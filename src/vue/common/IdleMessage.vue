<template>
  <div class="idle__message-wrapper">
    <drawer
      @close-drawer="redirectToSignin"
      :is-shown.sync="isDetailsDrawerShown"
    >
      <template slot="heading">
        {{ 'idle.form-heading' | globalize }}
      </template>
      <div>
        <h2 class="idle__message-text">
          {{ 'idle.notification-message' | globalize }}
        </h2>
      </div>
    </drawer>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import { vuexTypes } from '@/vuex'
import { mapMutations } from 'vuex'

export default {
  name: 'idle-message',
  components: {
    Drawer,
  },

  data: _ => ({
    isDetailsDrawerShown: false,
  }),

  onIdle () {
    this.isDetailsDrawerShown = true
    this.clearState()
  },

  computed: {
    email: vuexTypes.walletEmail,
    typeI: vuexTypes.accountTypeI,
  },

  methods: {
    ...mapMutations({
      clearState: vuexTypes.CLEAR_STATE,
    }),
    redirectToSignin () {
      location.reload()
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.idle__message-wrapper {
  position: relative;
  z-index: $z-idle;
}

.idle__message-text {
  max-width: 70%;
  margin-top: 5rem;
  line-height: 4rem;

  @include respond-to($x-small) {
    max-width: 100%;
    margin-top: 3rem;
  }
}
</style>
