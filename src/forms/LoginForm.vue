<script lang="ts" setup>
import { AppButton } from '@/common'
import { InputField } from '@/fields'

import { reactive } from 'vue'
import { Bus, ErrorHandler, sleep } from '@/helpers'
import { useI18n } from 'vue-i18n'
import { useForm, useFormValidation } from '@/composables'
import { email, required } from '@/validators'

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
    await sleep(5000)
    Bus.success(t('login-form.login-success-msg'))
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<template>
  <form class="login-form" @submit.prevent="submit">
    <div class="login-form__headings">
      <h4 class="login-form__title">
        {{ $t('login-form.title') }}
      </h4>
      <span class="login-form__subtitle">
        {{ $t('login-form.subtitle') }}
      </span>
    </div>
    <div class="login-form__oauth-wrp">
      <app-button
        class="login-form__oauth-btn"
        modifications="icon-first border-rounded info"
        :text="$t('login-form.oauth-facebook')"
        :icon-name="$icons.search"
      />
      <app-button
        class="login-form__oauth-btn"
        modifications="icon-first border-rounded error"
        :text="$t('login-form.oauth-google')"
        :icon-name="$icons.search"
      />
    </div>
    <span class="login-form__divider">
      {{ $t('login-form.divider-msg') }}
    </span>
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
    <app-button
      class="login-form__submit-btn"
      type="submit"
      :text="$t('login-form.submit-btn')"
      :disabled="isFormDisabled"
    />
    <i18n-t keypath="login-form.refs" tag="div" class="login-form__refs">
      <template #link>
        <router-link
          class="login-form__refs-link"
          :to="{ name: $routes.register }"
        >
          {{ $t('login-form.register-link') }}
        </router-link>
      </template>
    </i18n-t>
  </form>
</template>

<style lang="scss" scoped>
.login-form {
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

.login-form__title {
  margin-bottom: toRem(8);
}

.login-form__subtitle {
  color: var(--text-secondary-main);
}

.login-form__oauth-wrp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: toRem(16);
}

.login-form__oauth-btn {
  width: 100%;
}

.login-form__divider {
  text-align: center;
  color: var(--text-secondary-main);
}

.login-form__submit-btn {
  width: 100%;
}

.login-form__refs {
  color: var(--text-secondary-main);
}

.login-form__refs-link {
  text-decoration: underline;
  font-weight: 500;
}
</style>
