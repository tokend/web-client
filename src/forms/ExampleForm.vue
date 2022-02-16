<template>
  <form
    class="example-form"
    @submit.prevent="isFormValid() && submit()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.inputExample"
          :label="$t('example-form.input-example-lbl')"
          :placeholder="$t('example-form.input-placeholder')"
          :error-message="getFieldErrorMessage('inputExample').value"
          @blur="touchField('inputExample')"
          :disabled="formController.isDisabled.value"
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
          :disabled="formController.isDisabled.value"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.tickExample"
          :label="$t('example-form.tick-example-lbl')"
          :disabled="formController.isDisabled.value"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <app-button
        type="submit"
        :text="$t('example-form.submit-btn')"
      />
      <app-button
        schemes="flat"
        :text="$t('example-form.cancel-btn')"
        type="button"
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
import { required } from '@/validators'

export default defineComponent({
  name: 'example-form',
  components: { AppButton, TickField, InputField },
  setup () {
    const form = reactive({
      inputExample: '',
      inputNumberExample: 0,
      tickExample: false,
    })

    const formController = useForm()
    const validationController = useFormValidation({
      inputExample: {
        required,
      },
    }, toRefs(form))

    const submit = async () => {
      formController.disableForm
      try {
        Bus.success('example-form.example-success-msg')
      } catch (error) {
        ErrorHandler.process(error as Error)
      }
      formController.enableForm
    }

    return {
      form,
      submit,
      formController,
      ...toRefs(validationController),
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
