<template>
  <div
    v-if="isLoggedOut"
    class="idle-message-wrapper"
  >
    <div class="idle-message">
      <p class="idle-message__text">
        {{ "idle-message.notification-message" | globalize }}
      </p>
      <div class="idle-message__btn-wrp">
        <button
          class="idle-message__btn"
          @click="closeSelf"
        >
          {{ "idle-message.close-lbl" | globalize }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'idle-message',
  data () {
    return {
      isLoggedOut: false,
    }
  },
  created () {
    this.showIdleNotification()
  },
  methods: {
    showIdleNotification () {
      const routeQuery = this.$route.query || ''
      if (routeQuery.redirectPath.includes('isIdle=true')) {
        this.isLoggedOut = true
      }
    },
    closeSelf () {
      this.isLoggedOut = false
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.idle-message-wrapper {
  margin-top: -6rem;
  margin-bottom: 4rem;
}

.idle-message {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1.7rem 2rem;
  background-color: $col-warning;
  text-decoration: none;
}

.idle-message__text {
  color: $col-text-msg-warning;
  font-size: 1.6rem;
  font-weight: bold;
}

.idle-message__btn-wrp {
  margin-left: 1rem;
}

.idle-message__btn {
  @include button-raised();
  background: transparent;
  border: 0.1rem solid $col-text-msg-warning;

  &:hover {
    background-color: $col-button-raised;
    border: 0.1rem solid transparent;
  }
}
</style>
