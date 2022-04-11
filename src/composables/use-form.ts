import { reactive, ref, Ref, UnwrapNestedRefs } from 'vue'

interface IFormController {
  isDisabled: Ref<boolean>
  isPending: Ref<boolean>
  isConfirmationShown: Ref<boolean>
  disableForm: () => void
  enableForm: () => void
  showConfirmation: () => void
  hideConfirmation: () => void
  hideConfirmationAfterSubmit: (submitFn: () => void) => Promise<void>
}

export function useForm(): UnwrapNestedRefs<IFormController> {
  const isDisabled = ref(false)
  const isPending = ref(false)
  const isConfirmationShown = ref(false)

  const disableForm = () => {
    isDisabled.value = true
  }

  const enableForm = () => {
    isDisabled.value = false
  }

  const showConfirmation = () => {
    disableForm()
    isConfirmationShown.value = true
  }

  const hideConfirmation = () => {
    enableForm()
    isConfirmationShown.value = false
  }

  const hideConfirmationAfterSubmit = async (submitFn: () => void) => {
    isPending.value = true
    await submitFn()
    hideConfirmation()
    isPending.value = false
  }

  return reactive({
    isDisabled,
    isPending,
    isConfirmationShown,
    disableForm,
    enableForm,
    showConfirmation,
    hideConfirmation,
    hideConfirmationAfterSubmit,
  })
}
