<template>
  <teleport to="#modal">
    <transition name="modal">
      <div v-show="isShown" class="modal">
        <div class="modal__pane" ref="modalPane">
          <slot :modal="{ close: closeModal }" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const EVENTS = {
  updateIsShown: 'update:is-shown',
}

export default defineComponent({
  name: 'modal',
  props: {
    isShown: {
      type: Boolean,
      default: false,
    },
    isCloseByClickOutside: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const modalPane = ref<HTMLElement | undefined>()

    onMounted(() => {
      if (modalPane.value) {
        if (props.isCloseByClickOutside) {
          onClickOutside(modalPane, () => {
            closeModal()
          })
        }
      }
    })

    const closeModal = () => {
      emit(EVENTS.updateIsShown, false)
    }

    return {
      modalPane,

      closeModal,
    }
  },
})
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: vh(100);
  background: rgba(var(--black-rgb), 0.5);
}

.modal__pane {
  position: relative;
  background: var(--app-bg);
  padding: toRem(50) toRem(100);
  border-radius: toRem(10);
}

.modal-enter-active,
.modal-leave-active {
  transition: 0.25s ease;
  transition-property: opacity, transform;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
