<template>
  <div class="spinner" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'spinner',
})
</script>

<style lang="scss" scoped>
.spinner {
  display: inline-block;
  width: toRem(80);
  height: toRem(80);
}

.spinner:after {
  content: ' ';
  display: block;
  width: toRem(64);
  height: toRem(64);
  margin: toRem(8);
  border-radius: 50%;
  border: toRem(6) solid var(--border-primary-main);
  border-color: var(--border-primary-main) transparent
    var(--border-primary-main) transparent;
  animation: spinner 1.2s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
