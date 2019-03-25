<template>
  <div class="idle-message-wrapper">
    <div class="idle-message">
      <p class="idle-message__text">
        {{ "idle-message.notification-message" | globalize }}
      </p>
      <div class="idle-message__btn-wrp">
        <button class="idle-message__btn" @click="closeSelf">
          {{ "idle-message.close-lbl" | globalize }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const EVENTS = {
  updateIsShown: 'update:isShown',
}

export default {
  name: 'idle-message',
  props: {
    isLoggedout: { type: Boolean, default: false },
  },
  methods: {
    closeSelf () {
      this.$emit(EVENTS.updateIsShown, false)
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.idle-message-wrapper {
  display: inline-block;
  margin-left: 50px;
  margin-right: -30px; //hack

  @include respond-to($x-small) {
    display: block;
    margin: 0 auto 2rem;
  }
}

.idle-message {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 25.4rem;
  height: 14.7rem;
  padding: 3.2rem;
  background-color: $col-block-bg;
  text-decoration: none;

  @include box-shadow();

  &[disabled] {
    opacity: 0.7;
    cursor: default;
    box-shadow: none;
    filter: grayscale(100%);
  }
  @include respond-to($x-small) {
    width: 100%
  }
}

.idle-message__text {
  margin-top: .8rem;
  margin-bottom: 1rem;
  color: $col-secondary;
  font-size: 1.5rem;
  text-align: center;
}

.idle-message__btn-wrp {
  text-align: center;
}

.idle-message__btn {
  background: transparent;
  border: .1rem solid $col-info;
  border-radius: .5rem;
  font-size: 1.8rem;
  padding: .5rem 2rem;
  color: $col-info;
  cursor: pointer;
  transition: .2s;

  &:hover { opacity: .75 }
}

</style>
