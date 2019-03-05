<template>
  <transition name="drawer-transition">
    <div class="drawer" v-if="isShown">
      <div class="drawer__backdrop" @click="closeSelf" />
      <div class="drawer__pane">
        <div class="drawer__head">
          <h2 class="drawer__heading">
            <slot name="heading" />
          </h2>
          <button class="app__button-icon drawer__close-btn" @click="closeSelf">
            <i class="mdi mdi-close drawer__close-icon" />
          </button>
        </div>
        <div class="drawer__body">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
const EVENTS = {
  onClose: 'on-close',
  updateIsShown: 'update:isShown',
}

/**
 * Drawer component serves as a wrapper for modal content.
 *
 * To use it pass your content as a slot inside and sync it's prop with the
 * data field in your parent component:
 *
 * <drawer :is-shown.sync="isContentShown">
 *    <content>
 * </drawer>
 *
 * As long as `isContentShown` is `true`, your content will be displayed.
 */
export default {
  props: {
    isShown: { type: Boolean, default: true },
  },
  methods: {
    closeSelf () {
      this.$emit(EVENTS.updateIsShown, false)
      this.$emit(EVENTS.onClose)
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';

.drawer {
  position: fixed;
  width: 100vw;
  min-height: 100vh;
  top: 0;
  left: 0;
  z-index: $z-drawer;
}

.drawer__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.1)
}

.drawer__close-btn {
  padding: 0;
  width: 4.5rem;
  height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer__close-icon {
  display: flex;
  font-size: 2.4rem;
  margin-top: -.2rem; // magic value to align icon in the center

  &:before {
    font-weight: 700;
    vertical-align: middle;
  }
}

.drawer__pane {
  position: absolute;
  top: 0;
  right: 0;
  width: 52.8rem;
  max-width: 100%;
  min-height: 100%;
  height: 100%;
  box-shadow: 0 1rem 2rem 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.drawer__head {
  padding: 3rem;
  background-color: $col-drawer-head-bg;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.drawer__heading {
  font-size: 2.6rem;
  color: $col-drawer-head-text;
  line-height: normal;
  font-weight: 400;
}

.drawer__body {
  padding: 3rem;
  background-color: $col-drawer-bg;
  flex: 1;

  // allows to scroll drawer content when it height more than drawer height
  overflow-y: auto;
  height: 0;
}

.drawer-transition-enter-active {
  animation-duration: .2s;
  & > .drawer__backdrop {
    animation: drawer-backdrop-keyframes 0.2s ease-in-out;
  }
  & > .drawer__pane {
    animation: drawer-pane-keyframes 0.2s ease-in-out;
  }
}

.drawer-transition-leave-active {
  animation-duration: .175s;
  & > .drawer__backdrop {
    animation: drawer-backdrop-keyframes 0.2s ease-in-out reverse;
  }
  & > .drawer__pane {
    animation: drawer-pane-keyframes 0.2s ease-in-out reverse;
  }
}

@keyframes drawer-backdrop-keyframes {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes drawer-pane-keyframes {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
