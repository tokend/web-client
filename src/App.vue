<template>
  <div class="app__container">
    <router-view v-slot="{ Component, route }">
      <transition
        :name="route.meta.transition || 'fade'"
        mode="out-in"
      >
        <component
          class="app__main"
          :is="Component"
        />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'app',
  setup () {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.app__container {
  overflow: hidden;
  display: grid;
  grid-template-rows: toRem(108) 1fr;
  flex: 1;
}

.app__main {
  padding: toRem(30) var(--app-padding-right) 0 var(--app-padding-left);

  @include respond-to(medium) {
    padding-right: var(--app-padding-right-tablet);
    padding-left: var(--app-padding-left-tablet);
  }

  @include respond-to(xsmall) {
    padding-right: var(--app-padding-right-xsmall);
    padding-left: var(--app-padding-left-xsmall);
  }
}

.fade-enter-active {
  animation: fade-in 0.25s;
}

.fade-leave-active {
  animation: fade-in 0.25s reverse;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
