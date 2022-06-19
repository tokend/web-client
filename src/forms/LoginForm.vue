<template>
  <form class="login-form" @submit.prevent="submit">
    <input-field
      v-model="form.login"
      :label="$t('login-form.login-lbl')"
      :error-message="getFieldErrorMessage('login')"
      @blur="touchField('login')"
      :disabled="isFormDisabled"
    />
    <input-field
      type="password"
      v-model="form.password"
      :label="$t('login-form.password-lbl')"
      :error-message="getFieldErrorMessage('password')"
      @blur="touchField('password')"
      :disabled="isFormDisabled"
    />
    <div class="login-form__actions">
      <app-button
        class="login-form__submit-btn"
        type="submit"
        :text="$t('login-form.submit-btn')"
        :disabled="isFormDisabled"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { AppButton } from '@/common'
import { InputField } from '@/fields'

import { defineComponent, reactive } from 'vue'
import { Bus, ErrorHandler } from '@/helpers'
import { useI18n } from 'vue-i18n'
import { useForm, useFormValidation } from '@/composables'
import { email, required } from '@/validators'

export default defineComponent({
  name: 'login-form',
  components: { AppButton, InputField },
  setup() {
    const { t } = useI18n({ useScope: 'global' })
    const form = reactive({
      login: '',
      password: '',
    })

    const { isFormDisabled, disableForm, enableForm } = useForm()

    const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
      form,
      {
        login: { email, required },
        password: { required },
      },
    )

    const submit = async () => {
      if (!isFormValid()) return

      disableForm()
      try {
        Bus.success(t('login-form.login-success-msg'))
      } catch (error) {
        ErrorHandler.process(error)
      }
      enableForm()
    }
    return {
      form,

      isFormDisabled,

      getFieldErrorMessage,
      touchField,

      submit,
    }
  },
})
</script>

<style lang="scss" scoped>
.login-form {
  display: grid;
  grid-gap: toRem(24);
}
</style>
