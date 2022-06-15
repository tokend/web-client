<template>
  <div class="inputs-page">
    <div class="inputs-page__row">
      <div class="inputs-page__col">
        <input-field
          :label="'label'"
          :placeholder="$t('inputs-page.some-placeholder')"
        />
        <input-field
          :label="$t('inputs-page.some-label')"
          :error-message="$t('inputs-page.some-error-message')"
          :placeholder="$t('inputs-page.some-placeholder')"
        />
        <input-field
          :label="$t('inputs-page.some-label')"
          :placeholder="$t('inputs-page.some-placeholder')"
          disabled
        />
        <input-field
          :label="$t('inputs-page.some-label')"
          :error-message="$t('inputs-page.some-error-message')"
          :placeholder="$t('inputs-page.some-placeholder')"
          disabled
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { InputField } from '@/fields'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'inputs-page',
  components: { InputField },
})
</script>

<style lang="scss" scoped>
.inputs-page {
  display: grid;
  grid-gap: toRem(50);
}

.inputs-page__row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.inputs-page__col {
  display: grid;
  grid-gap: toRem(10);
}
</style>
