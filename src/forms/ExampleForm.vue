<template>
  <form
    class="example-form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.inputExample"
          :label="$t('example-form.input-example-lbl')"
          :placeholder="$t('example-form.input-placeholder')"
          :error-message="form.inputExample"
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

import { Bus, ErrorHandler } from '@/helpers'
import { defineComponent, reactive } from 'vue'
import { useForm } from '@/composables'
import AppButton from '@/common/AppButton.vue'

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
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
