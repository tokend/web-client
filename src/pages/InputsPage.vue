<template>
  <div class="inputs-page">
    <div class="inputs-page__row">
      <div class="inputs-page__col">
        <input-field
          v-model="form.inputValue"
          :label="'label'"
          :placeholder="$t('inputs-page.some-placeholder')"
        />
        <input-field
          v-model="form.inputValue"
          :label="'label'"
          :placeholder="$t('inputs-page.some-placeholder')"
          :icon-name="$icons.dotsVertical"
        />
        <input-field
          v-model="form.inputValue"
          schemes="icon-left"
          :label="'label'"
          :placeholder="$t('inputs-page.some-placeholder')"
          :icon-name="$icons.dotsVertical"
        />
        <input-field
          v-model="form.inputValue"
          type="password"
          :label="'label'"
          :placeholder="$t('inputs-page.some-placeholder')"
        />
        <input-field
          v-model="form.inputValue"
          :label="$t('inputs-page.some-label')"
          :error-message="$t('inputs-page.some-error-message')"
          :placeholder="$t('inputs-page.some-placeholder')"
        />
        <input-field
          v-model="form.inputValue"
          :label="$t('inputs-page.some-label')"
          :placeholder="$t('inputs-page.some-placeholder')"
          disabled
        />
        <input-field
          v-model="form.inputValue"
          :label="$t('inputs-page.some-label')"
          :error-message="$t('inputs-page.some-error-message')"
          :placeholder="$t('inputs-page.some-placeholder')"
          disabled
        />
        <checkbox-field
          v-model="form.chbValue"
          :label="$t('inputs-page.some-label')"
        />
        <checkbox-field
          v-model="form.chbValue"
          :label="$t('inputs-page.some-label')"
          disabled
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CheckboxField, InputField } from '@/fields'

import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'inputs-page',
  components: { InputField, CheckboxField },
  setup() {
    const form = reactive({
      chbValue: false,
      inputValue: '',
    })

    return {
      form,
    }
  },
})
</script>

<style lang="scss" scoped>
.inputs-page {
  display: grid;
  grid-gap: toRem(50);
  padding-bottom: toRem(100);
}

.inputs-page__row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: toRem(24);
}

.inputs-page__col {
  display: grid;
  align-content: start;
  grid-gap: toRem(10);
}
</style>
