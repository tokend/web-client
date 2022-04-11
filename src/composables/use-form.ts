import { ref, Ref } from 'vue'

interface IFormController {
  isFormDisabled: Ref<boolean>
  isFormPending: Ref<boolean>
  isConfirmationShown: Ref<boolean>
  disableForm: () => void
  enableForm: () => void
  showConfirmation: () => void
  hideConfirmation: () => void
  hideConfirmationAfterSubmit: (submitFn: () => void) => Promise<void>
}

export function useForm(): IFormController {
  const isFormDisabled = ref(false)
  const isFormPending = ref(false)
  const isConfirmationShown = ref(false)

  const disableForm = () => {
    isFormDisabled.value = true
  }

  const enableForm = () => {
    isFormDisabled.value = false
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
    isFormPending.value = true
    await submitFn()
    hideConfirmation()
    isFormPending.value = false
  }

  // TODO: invalid structure - useForm var should be unreactive in destruct
  //  reactive in ...toRefs as like as PiniaJS
  return {
    isFormDisabled,
    isFormPending,
    isConfirmationShown,
    disableForm,
    enableForm,
    showConfirmation,
    hideConfirmation,
    hideConfirmationAfterSubmit,
  }
}
