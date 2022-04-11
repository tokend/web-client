import { computed, ComputedRef, UnwrapNestedRefs } from 'vue'
import useVuelidate, { ChildStateLeafs, ValidationArgs } from '@vuelidate/core'
import { get } from 'lodash-es'

interface IFormValidation {
  isFieldsValid: ComputedRef<boolean>
  getFieldErrorMessage: (fieldPath: string) => string
  touchField: (fieldPath: string) => void
  isFormValid: () => boolean
}

export const useFormValidation = (
  rules: ValidationArgs,
  state: UnwrapNestedRefs<ChildStateLeafs>,
): IFormValidation => {
  const validationRules = computed(() => ({
    ...rules,
  }))

  const validationController = useVuelidate(validationRules, state)

  const isFieldsValid = computed(() => !validationController.value.$invalid)

  const getFieldErrorMessage = (fieldPath: string): string => {
    let errorMessage = ''
    if (!validationController.value || !validationController.value.$invalid) {
      errorMessage = ''
    }

    const field = get(validationController.value, fieldPath)

    if (!field || !Object.keys(field).length) {
      throw new Error(
        `getFieldErrorMessage: Cannot find vuelidate field by '${fieldPath}'`,
      )
    }

    if (!field.$dirty) errorMessage = ''

    errorMessage = field.$errors.length
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
