<script lang="ts" setup>
import { AppButton } from '@/common'
import { InputField, CheckboxField } from '@/fields'

import { reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useFormValidation } from '@/composables'
import {
  email,
  maxLength,
  minLength,
  required,
  sameAs,
  checked,
} from '@/validators'
import { Bus, ErrorHandler, sleep } from '@/helpers'
import { INPUT_LIMITS } from '@/enums'

const { t } = useI18n({ useScope: 'global' })
const form = reactive({
  fname: '',
  lname: '',
  login: '',
  password: '',
  repeatPassword: '',
  isAgreeTerms: false,
})

const { isFormDisabled, disableForm, enableForm } = useForm()

const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    fname: {
      required,
      minLength: minLength(INPUT_LIMITS.textMinLength),
      maxLength: maxLength(INPUT_LIMITS.textMaxLength),
    },
    lname: {
      required,
      minLength: minLength(INPUT_LIMITS.textMinLength),
      maxLength: maxLength(INPUT_LIMITS.textMaxLength),
    },
    login: { email, required },
    password: {
      required,
      minLength: minLength(INPUT_LIMITS.passwordMinLength),
      maxLength: maxLength(INPUT_LIMITS.passwordMaxLength),
    },
    repeatPassword: { required, sameAs: sameAs(toRefs(form).password) },
    isAgreeTerms: { required, checked },
  },
)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    await sleep(5000)
    Bus.success(t('register-form.register-success-msg'))
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<template>
  <form class="register-form" @submit.prevent="submit">
    <div class="register-form__headings">
      <h4 class="register-form__title">
        {{ $t('register-form.title') }}
      </h4>
      <span class="register-form__subtitle">
        {{ $t('register-form.subtitle') }}
      </span>
    </div>
    <input-field
      v-model="form.fname"
      :label="$t('register-form.f-name-lbl')"
      :error-message="getFieldErrorMessage('fname')"
      @blur="touchField('fname')"
      :disabled="isFormDisabled"
    />
    <input-field
      v-model="form.lname"
      :label="$t('register-form.l-name-lbl')"
      :error-message="getFieldErrorMessage('lname')"
      @blur="touchField('lname')"
      :disabled="isFormDisabled"
    />
    <input-field
      v-model="form.login"
      :label="$t('register-form.login-lbl')"
      :error-message="getFieldErrorMessage('login')"
      @blur="touchField('login')"
      :disabled="isFormDisabled"
    />
    <input-field
      type="password"
      v-model="form.password"
      :label="$t('register-form.password-lbl')"
      :error-message="getFieldErrorMessage('password')"
      @blur="touchField('password')"
      :disabled="isFormDisabled"
    />
    <input-field
      type="password"
      v-model="form.repeatPassword"
      :label="$t('register-form.repeat-password-lbl')"
      :error-message="getFieldErrorMessage('repeatPassword')"
      @blur="touchField('repeatPassword')"
      :disabled="isFormDisabled"
    />
    <!--TODO: Terms of use link-->
    <div class="register-form__agreement">
      <checkbox-field
        v-model="form.isAgreeTerms"
        :label="$t('register-form.is-agree-lbl')"
        @blur="touchField('isAgreeTerms')"
        :disabled="isFormDisabled"
      />
      <router-link
        class="register-form__agreement-link"
        :to="{ name: $routes.login }"
      >
        {{ $t('register-form.terms-link') }}
      </router-link>
    </div>
    <app-button
      class="register-form__submit-btn"
      type="submit"
      :text="$t('register-form.submit-btn')"
      :disabled="isFormDisabled"
    />
    <i18n-t keypath="register-form.refs" tag="div" class="register-form__refs">
      <template #link>
        <router-link
          class="register-form__refs-link"
          :to="{ name: $routes.login }"
        >
          {{ $t('register-form.register-link') }}
        </router-link>
      </template>
    </i18n-t>
  </form>
</template>

<style lang="scss" scoped>
.register-form {
  display: grid;
  grid-gap: toRem(24);
  background: var(--bg-primary-light);
  padding: toRem(32) toRem(24);
  max-width: toRem(550);
  width: 100%;
  border-radius: toRem(8);
  box-shadow: toRem(0) toRem(4) toRem(6) toRem(-2) rgba(100, 116, 139, 0.05),
    toRem(0) toRem(10) toRem(15) toRem(-3) rgba(100, 116, 139, 0.12);
}

.register-form__title {
  margin-bottom: toRem(8);
}

.register-form__subtitle {
  color: var(--text-secondary-main);
}

.register-form__agreement {
  display: flex;
  align-items: center;
  gap: toRem(4);
}

.register-form__agreement-link {
  text-decoration: underline;
  font-weight: 500;
}

.register-form__submit-btn {
  width: 100%;
}

.register-form__refs {
  color: var(--text-secondary-main);
}

.register-form__refs-link {
  text-decoration: underline;
  font-weight: 500;
}
</style>
