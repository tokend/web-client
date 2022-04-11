<template>
  <form
    class="example-form"
    @submit.prevent="validationController.isFormValid() && submit()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.inputExample"
          :label="$t('example-form.input-example-lbl')"
          :placeholder="$t('example-form.input-placeholder')"
          :error-message="
            validationController.getFieldErrorMessage('inputExample')
          "
          @blur="validationController.touchField('inputExample')"
          :disabled="formController.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.inputNumberExample"
          type="number"
          :label="$t('example-form.input-number-example-lbl')"
          :placeholder="$t('example-form.input-number-placeholder')"
          :error-message="form.inputNumberExample"
          :disabled="formController.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.tickExample"
          :label="$t('example-form.tick-example-lbl')"
          :disabled="formController.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <app-button type="submit" :text="$t('example-form.submit-btn')" />
      <app-button schemes="flat" :text="$t('example-form.cancel-btn')" />
      <app-button
        schemes="flat"
        :text="$t('example-form.success-msg')"
        @click="callSuccess"
      />
      <app-button
        schemes="flat"
        :text="$t('example-form.error-msg')"
        @click="callError"
      />
      <app-button
        schemes="flat"
        :text="$t('example-form.warning-msg')"
        @click="callWarning"
      />
      <app-button
        schemes="flat"
        :text="$t('example-form.info-msg')"
        @click="callInfo"
      />
    </div>
  </form>
</template>

<script lang="ts">
import InputField from '@/fields/InputField.vue'
import TickField from '@/fields/TickField.vue'
import AppButton from '@/common/AppButton.vue'

import { Bus, ErrorHandler } from '@/helpers'
import { defineComponent, reactive, toRefs } from 'vue'
import { useForm, useFormValidation } from '@/composables'
import { maxLength, required } from '@/validators'
import { ICON_NAMES } from '@/enums'
import { i18n } from '@/localization'

export default defineComponent({
  name: 'example-form',
  components: { AppButton, TickField, InputField },
  setup() {
    const form = reactive({
      inputExample: '',
      inputNumberExample: 0,
      tickExample: false,
    })

    const formController = useForm()
    const validationController = useFormValidation(
      {
        inputExample: {
          required,
          maxLength: maxLength(32),
        },
      },
      toRefs(form),
    )

    const submit = async () => {
      formController.disableForm()
      try {
        Bus.error({
          message: i18n.global.t('example-form.example-success-msg'),
          iconName: ICON_NAMES.folder,
        })
      } catch (error) {
        ErrorHandler.process(error)
      }
      formController.enableForm()
    }

    const callError = () => {
      Bus.error(i18n.global.t('example-form.error-msg'))
    }
    const callSuccess = () => {
      Bus.success(i18n.global.t('example-form.success-msg'))
    }
    const callWarning = () => {
      formController.disableForm()
      Bus.warning(i18n.global.t('example-form.warning-msg'))
    }
    const callInfo = () => {
      formController.enableForm()
      Bus.info(i18n.global.t('example-form.info-msg'))
    }

    return {
      form,
      formController,
      validationController,
      isFieldsValid: validationController.isFieldsValid,
      submit,
      callError,
      callSuccess,
      callWarning,
      callInfo,
    }
  },
})
</script>

<style lang="scss" scoped></style>
