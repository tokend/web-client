<template>
  <div class="buttons-page">
    <div class="buttons-page__row">
      <div class="buttons-page__col">
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="border-rounded"
          :icon-name="$icons.gift"
          :text="'primary, border-rounded'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="border-circle"
          :text="'primary, border-circle'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="icon-first"
          :text="'primary, icon-first'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="big"
          :text="'primary, big'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="small"
          :text="'primary, small'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="success"
          :text="'primary, success'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="error"
          :text="'primary, error'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="warning"
          :text="'primary, warning'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="info"
          :text="'primary, info'"
        />
      </div>
      <div class="buttons-page__col">
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="border-circle success"
          :text="'primary, border-circle, success'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="border-rounded error"
          :text="'primary, border-rounded, error'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="icon-first"
          :icon-name="$icons.gift"
          :text="'primary, icon-first'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="big warning"
          :text="'primary, big, warning'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="small info"
          :text="'primary, small, info'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="success"
          :text="'primary, success'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="error"
          :text="'primary, error'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="warning"
          :text="'primary, warning'"
        />
        <app-button
          class="buttons-page__button"
          schemes="primary"
          modifications="info"
          :text="'primary, info'"
        />
      </div>
    </div>
    <div class="buttons-page__row">
      <div class="buttons-page__col">
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="border-circle"
          :text="'flat, border-circle'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="border-rounded"
          :icon-name="$icons.gift"
          :text="'flat, border-rounded'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="icon-first"
          :text="'flat, icon-first'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="big"
          :text="'flat, big'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="small"
          :text="'flat, small'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="success"
          :text="'flat, success'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="error"
          :text="'flat, error'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="warning"
          :text="'flat, warning'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="info"
          :text="'flat, info'"
        />
      </div>
      <div class="buttons-page__col">
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="border-circle success"
          :text="'flat, border-circle, success'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="border-rounded error"
          :text="'flat, border-rounded, error'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="icon-first"
          :icon-name="$icons.gift"
          :text="'flat, icon-first'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="big warning"
          :text="'flat, big, warning'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="small info"
          :text="'flat, small, info'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="success"
          :text="'flat, success'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="error"
          :text="'flat, error'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="warning"
          :text="'flat, warning'"
        />
        <app-button
          class="buttons-page__button"
          schemes="flat"
          modifications="info"
          :text="'flat, info'"
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
