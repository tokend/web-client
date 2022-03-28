<template>
  <div class="collapse" ref="rootEl">
    <div class="collapse__head">
      <slot
        name="head"
        :collapse="{
          isOpen: isCollapseOpen,
          toggle: toggleCollapse,
          close: closeCollapse,
        }"
      />
    </div>
    <transition
      name="collapse__body-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <div v-if="isCollapseOpen" class="collapse__body">
        <slot
          :collapse="{
            isOpen: isCollapseOpen,
            toggle: toggleCollapse,
            close: closeCollapse,
          }"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from '@/router'

export default defineComponent({
  name: 'collapse',
  setup() {
    const rootEl = ref<HTMLElement | null>(null)
    const destructClickOutsideHandler = ref<() => void | undefined>()
    const isCollapseOpen = ref(false)
    const router = useRouter()

    router.afterEach(() => {
      closeCollapse()
    })

    const toggleCollapse = () => {
      isCollapseOpen.value ? closeCollapse() : openCollapse()
    }
    const closeCollapse = () => {
      isCollapseOpen.value = false

      if (destructClickOutsideHandler.value) {
        destructClickOutsideHandler.value()
      }
    }
    const openCollapse = () => {
      isCollapseOpen.value = true
      destructClickOutsideHandler.value = onClickOutside(
        rootEl.value,
        closeCollapse,
      )
    }

    const setHeightCSSVar = (element: HTMLElement) => {
      element.style.setProperty(
        '--collapse-body-height',
        `${element.scrollHeight}px`,
      )
    }

    return {
      rootEl,
      isCollapseOpen,
      toggleCollapse,
      closeCollapse,
      setHeightCSSVar,
    }
  },
})
</script>

<style lang="scss" scoped>
.collapse__body {
  overflow: hidden;
}

.collapse__body-transition-enter-active {
  animation: collapse-frame-keyframes 0.25s ease-in-out;
}

.collapse__body-transition-leave-active {
  animation: collapse-frame-keyframes 0.25s ease-in-out reverse;
}

@keyframes collapse-frame-keyframes {
  from {
    height: 0;
  }

  to {
    height: var(--collapse-body-height);
  }
}
</style>
