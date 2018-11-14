<template>
  <transition name="drawer-transition">
    <div class="drawer" v-if="shown">
      <div class="drawer__backdrop" />
      <div class="drawer__pane">
        <div class="drawer__head">
          <h2 class="drawer__heading">
            <slot name="heading" />
          </h2>
        </div>
        <div class="drawer__body">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    shown: { type: Boolean, default: true }
  }
}
</script>

<style lang="scss">
.drawer {
  position: fixed;
  width: 100vw;
  min-height: 100vh;
  top: 0;
  left: 0;
  z-index: 10;
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

.drawer__pane {
  position: absolute;
  top: 0;
  right: 0;
  width: 528px;
  min-height: 100%;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.drawer__head {
  padding: 30px;
  background-color: #e9eaed;
}

.drawer__heading {
  font-size: 26px;
  color: #3a4180;
  line-height: normal;
}

.drawer__body {
  padding: 30px;
  background-color: #ffffff;
  flex: 1;
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
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
