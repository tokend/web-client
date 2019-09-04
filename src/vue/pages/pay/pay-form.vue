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
            v-model="form.amount"
            @blur="touchField('form.amount')"
            name="pay-amount"
            :label="'auth-pages.amount' | globalize"
            :error-message="getFieldErrorMessage('form.amount')"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.email"
            @blur="touchField('form.email')"
            name="recovery-email"
            :label="'auth-pages.email' | globalize"
            :error-message="getFieldErrorMessage('form.email')"
          />
        </div>
      </div>
      <div class="app__form-actions">
        <button
          v-ripple
          class="create-atomic-swap-form__submit-btn app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ 'create-atomic-swap-form.create-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { required } from '@validators'
// import { mapGetters } from 'vuex'
// import { vuexTypes } from '@/vuex'
// import { Bus } from '@/js/helpers/event-bus'
// import { ErrorHandler } from '@/js/helpers/error-handler'
// import { api } from '@/api'
// import { base } from '@tokend/js-sdk'
// import { MathUtil } from '@/js/utils/math.util'

export default {
  name: 'pay-form',
  components: {},
  mixins: [FormMixin],
  props: {
  },
  data () {
    return {
      form: {
        amount: '',
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
  computed: {},
  watch: {},
  created () {
  },
  destroyed () {
  },
  methods: {
    submit () {
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';
</style>
