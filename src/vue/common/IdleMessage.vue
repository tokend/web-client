<template>
  <div
    v-if="isMessageShown"
    class="idle-message-wrapper"
  >
    <div class="idle-message">
      <p class="idle-message__text">
        {{ "idle-message.notification-message" | globalize }}
      </p>
      <button
        class="idle-message__close-btn"
        @click="isMessageShown = false"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'idle-message',

  data: _ => ({
    isMessageShown: false,
  }),

  created () {
    this.tryShowMessageOnce()
  },

  methods: {
    tryShowMessageOnce () {
      if (this.queryHasIsIdle(this.$route.query)) {
        this.isMessageShown = true
        this.cleanQueryIsIdle(this.$route.query)
      }
    },

    queryHasIsIdle (query) {
      return query.isIdle || /isIdle=true/ig.test(query.redirectPath)
    },

    cleanQueryIsIdle (query) {
      const noIdleQuery = Object.assign({}, query)
      delete noIdleQuery.isIdle

      if (noIdleQuery.redirectPath) {
        noIdleQuery.redirectPath =
          noIdleQuery.redirectPath.replace(/(\?|&)?isIdle=(true|false)/ig, '')
      }

      this.$router.push({
        path: this.$route.path,
        query: noIdleQuery,
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.idle-message {
  align-items: center;
  padding: 2.4rem;
  background-color: $col-warning;
  position: relative;
}

.idle-message__text {
  color: $col-text-on-dark-bg;
  font-size: 1.4rem;
  line-height: 1.25;
  font-weight: 700;
}

.idle-message__close-btn {
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
</style>
