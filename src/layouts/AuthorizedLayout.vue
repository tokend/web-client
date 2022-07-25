<script lang="ts" setup>
import { AppNavbar } from '@/common'
</script>

<template>
  <div class="authorized-layout">
    <div class="authorized-layout__main-wrp">
      <app-navbar class="authorized-layout__navbar" />
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <component class="authorized-layout__main" :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.authorized-layout {
  display: grid;
  grid-template-columns: toRem(280) 1fr;
}

.authorized-layout__main-wrp {
  display: flex;
  flex-direction: column;
}

.authorized-layout__main {
  flex: 1;
  padding: toRem(64) var(--app-padding-right) toRem(64) var(--app-padding-left);
}
</style>
