<template>
  <div class="collapse" ref="rootEl">
    <div class="collapse__head">
      <slot
        name="head"
        :collapse="{
          isOpen: isCollapseOpen,
          toggle: toggleCollapse,
          open: openCollapse,
          close: closeCollapse,
        }"
      />
    </div>
    <transition
      name="collapse__body-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <div v-show="isCollapseOpen" class="collapse__body">
        <slot
          :collapse="{
            isOpen: isCollapseOpen,
            toggle: toggleCollapse,
            open: openCollapse,
            close: closeCollapse,
          }"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from '@/router'

export default defineComponent({
  name: 'collapse',
  props: {
    isOpenedByDefault: {
      type: Boolean,
      default: false,
    },
    isCloseByClickOutside: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const rootEl = ref<HTMLElement | null>(null)
    const isCollapseOpen = ref(props.isOpenedByDefault)
    const router = useRouter()

    router.afterEach(() => {
      closeCollapse()
    })

    onMounted(() => {
      if (rootEl.value) {
        if (props.isCloseByClickOutside) {
          onClickOutside(rootEl, () => {
            closeCollapse()
          })
        }
      }
    })

    const toggleCollapse = () => {
      isCollapseOpen.value ? closeCollapse() : openCollapse()
    }
    const closeCollapse = () => {
      isCollapseOpen.value = false
    }
    const openCollapse = () => {
      isCollapseOpen.value = true
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
      openCollapse,
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
