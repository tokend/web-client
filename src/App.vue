<script lang="ts" setup>
import { ErrorHandler } from '@/helpers/error-handler'
import { ref } from 'vue'
import { useNotifications } from '@/composables'
import { config } from '@config'

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
</script>

<template>
  <div v-if="isAppInitialized" class="app__container">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component class="app__main" :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.app__container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.app__main {
  flex: 1;
}
</style>
