<template>
  <div
    v-if="isMessageShown"
    class="session-message-wrapper"
  >
    <div class="session-message">
      <p class="session-message__text">
        {{ "session-message.notification-message" | globalize }}
      </p>
      <button
        class="session-message__close-btn"
        @click="isMessageShown = false"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'session-message',

  data: _ => ({
    isMessageShown: false,
  }),

  created () {
    this.tryShowMessageOnce()
  },

  methods: {
    tryShowMessageOnce () {
      if (this.queryHasIsSessionExpired(this.$route.query)) {
        this.isMessageShown = true
        this.cleanQueryIsSessionExpired(this.$route.query)
      }
    },

    queryHasIsSessionExpired (query) {
      return query.isSessionExpired || /isSessionExpired=true/ig.test(query.redirectPath)
    },

    cleanQueryIsSessionExpired (query) {
      const noSessionExpiredQuery = Object.assign({}, query)
      delete noSessionExpiredQuery.isSessionExpired

      if (noSessionExpiredQuery.redirectPath) {
        noSessionExpiredQuery.redirectPath =
          noSessionExpiredQuery.redirectPath.replace(/(\?|&)?isSessionExpired=(true|false)/ig, '')
      }

      this.$router.push({
        path: this.$route.path,
        query: noSessionExpiredQuery,
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.session-message {
  align-items: center;
  padding: 2.4rem;
  background-color: $col-warning;
  position: relative;
}

.session-message__text {
  color: $col-text-on-dark-bg;
  font-size: 1.4rem;
  line-height: 1.25;
  font-weight: 700;
}

.session-message__close-btn {
  position: absolute;
  width: 2.4rem;
  height: 2.4rem;
  top: 0.6rem;
  right: 0.6rem;

  &:after,
  &:before {
    content: '';
    height: 60%;
    width: 0.2rem;
    position: absolute;
    top: 20%;
    left: calc(50% - 0.1rem);
    background-color: $col-text-on-dark-bg;
  }

  &:after {
    transform: rotate(-45deg);
  }

  &:before {
    transform: rotate(45deg);
  }

  &:hover:after,
  &:hover:before {
    opacity: 0.7;
    transition: opacity 0.2s;
  }
}

.session-message-wrapper {
  margin-top: -6rem;
  margin-bottom: 4rem;
}
</style>
