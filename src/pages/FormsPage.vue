<template>
  <div class="forms-page">
    <div class="forms-page__row">
      <div class="forms-page__col">
        <login-form />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LoginForm from '@/forms/LoginForm.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'forms-page',
  components: { LoginForm },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.forms-page {
  display: grid;
  grid-gap: toRem(48);
}

.forms-page__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: toRem(24);
}
</style>
