<template>
  <form
    novalidate
    class="app__form create-poll-form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    Atomic swap form
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

export default {
  name: 'create-poll-form-module',
  mixins: [FormMixin],
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';
</style>
