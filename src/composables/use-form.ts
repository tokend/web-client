import { ref } from 'vue'

export function useForm() {
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
