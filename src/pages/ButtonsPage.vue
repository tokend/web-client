<template>
  <div class="buttons-page">
    <div class="buttons-page__row">
      <div class="buttons-page__col">
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="border-rounded"
          :icon-name="$icons.gift"
          :text="$t('primary, border-rounded')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="border-circle"
          :text="$t('primary, border-circle')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="icon-first"
          :text="$t('primary, icon-first')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="big"
          :text="$t('primary, big')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="small"
          :text="$t('primary, small')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="success"
          :text="$t('primary, success')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="error"
          :text="$t('primary, error')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="warning"
          :text="$t('primary, warning')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="info"
          :text="$t('primary, info')"
        />
      </div>
      <div class="buttons-page__col">
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="border-circle success"
          :text="$t('primary, border-circle, success')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="border-rounded error"
          :text="$t('primary, border-rounded, error')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="icon-first"
          :icon-name="$icons.gift"
          :text="$t('primary, icon-first')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="big warning"
          :text="$t('primary, big, warning')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="small info"
          :text="$t('primary, small, info')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="success"
          :text="$t('primary, success')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="error"
          :text="$t('primary, error')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="warning"
          :text="$t('primary, warning')"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="info"
          :text="$t('primary, info')"
        />
      </div>
    </div>
    <div class="buttons-page__row">
      <div class="buttons-page__col">
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="border-circle"
          :text="$t('flat, border-circle')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="border-rounded"
          :icon-name="$icons.gift"
          :text="$t('flat, border-rounded')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="icon-first"
          :text="$t('flat, icon-first')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="big"
          :text="$t('flat, big')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="small"
          :text="$t('flat, small')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="success"
          :text="$t('flat, success')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="error"
          :text="$t('flat, error')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="warning"
          :text="$t('flat, warning')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="info"
          :text="$t('flat, info')"
        />
      </div>
      <div class="buttons-page__col">
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="border-circle success"
          :text="$t('flat, border-circle, success')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="border-rounded error"
          :text="$t('flat, border-rounded, error')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="icon-first"
          :icon-name="$icons.gift"
          :text="$t('flat, icon-first')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="big warning"
          :text="$t('flat, big, warning')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="small info"
          :text="$t('flat, small, info')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="success"
          :text="$t('flat, success')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="error"
          :text="$t('flat, error')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="warning"
          :text="$t('flat, warning')"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="info"
          :text="$t('flat, info')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AppButton } from '@/common'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'buttons-page',
  components: { AppButton },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.buttons-page {
  display: grid;
  grid-gap: toRem(50);
}

.buttons-page__row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.buttons-page__col {
  display: grid;
  grid-gap: toRem(10);
}
</style>
