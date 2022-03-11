import { computed, ComputedRef, ref, Ref, ToRefs } from 'vue'
import useVuelidate, { ValidationArgs } from '@vuelidate/core'
import { get } from 'lodash-es'

interface IFormValidation {
  isFieldsValid: ComputedRef<boolean>
  getFieldErrorMessage: (fieldPath: string) => Ref<string>
  touchField: (fieldPath: string) => void
  isFormValid: () => boolean
}

export const useFormValidation = (
  rules: ValidationArgs,
  state: ToRefs,
): IFormValidation => {
  const validationRules = computed(() => ({
    ...rules,
  }))

  const validationController = useVuelidate(validationRules, state)

  const isFieldsValid = computed(() => !validationController.value.$invalid)

  const getFieldErrorMessage = (fieldPath: string): Ref<string> => {
    const errorMessage = ref('')
    if (!validationController.value || !validationController.value.$invalid) {
      errorMessage.value = ''
    }

    const field = get(validationController.value, fieldPath)

    if (!field || !Object.keys(field).length) {
      throw new Error(
        `getFieldErrorMessage: Cannot find vuelidate field by '${fieldPath}'`,
      )
    }

    if (!field.$dirty) errorMessage.value = ''

    errorMessage.value = field.$errors.length
      ? (field.$errors[0].$message as string)
      : ''

    return errorMessage
  }

  const touchField = (fieldPath: string): void => {
    const field = get(validationController.value, fieldPath)
    if (field) {
      field.$touch()
    }
  }

  const isFormValid = (): boolean => {
    validationController.value.$touch()
    return !validationController.value.$invalid
  }

  return {
    isFieldsValid,
    getFieldErrorMessage,
    touchField,
    isFormValid,
  }
}
