<template>
  <div v-if="isAppInitialized" class="app__container">
    <app-navbar class="app__navbar" />
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component class="app__main" :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { AppNavbar } from '@/common'

import { ErrorHandler } from '@/helpers/error-handler'
import { defineComponent, ref } from 'vue'
import { useNotifications } from '@/composables'
import { config } from '@config'

export default defineComponent({
  name: 'app',
  components: { AppNavbar },
  setup() {
    const isAppInitialized = ref(false)
    const init = async () => {
      try {
        useNotifications()
        document.title = config.APP_NAME
      } catch (error) {
        ErrorHandler.process(error)
      }
      isAppInitialized.value = true
    }

    init()

    return {
      isAppInitialized,
    }
  },
})
</script>

<style lang="scss" scoped>
.app__container {
  overflow: hidden;
  display: grid;
  grid-template-rows: toRem(85) 1fr max-content;
  flex: 1;

  @include respond-to(small) {
    grid-template-rows: max-content 1fr max-content;
  }
}

.app__main {
  padding: 0 var(--app-padding-right) 0 var(--app-padding-left);
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
