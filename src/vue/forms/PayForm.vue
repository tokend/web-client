<template>
  <div>
    <form
      novalidate
      class="app__form"
      @submit.prevent="submit()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.email"
            @blur="touchField('form.email')"
            name="pay-email"
            :label="'pay-form.email' | globalize"
            :error-message="getFieldErrorMessage('form.email')"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { required } from '@validators'

export default {
  name: 'pay-form',
  mixins: [FormMixin],

  data () {
    return {
      form: {
        email: '',
      },
    }
  },

  validations () {
    return {
      form: {
        amount: {
          required,
        },
        email: {
          required,
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';
</style>
