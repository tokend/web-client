<template>
  <form class="login-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          :label="globalize('auth.email')"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.password"
          :label="globalize('auth.password')"
          type="password"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <button class="login-form__submit-btn">
        {{ 'auth.sign-in' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '../mixins/form.mixin'

import { globalize } from '@/vue/filters/globalize'

export default {
  name: 'login-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      email: '',
      password: ''
    }
  }),
  validations: {
    form: {
      email: {},
      password: {}
    }
  },
  methods: {
    globalize,
    submit () {
      // TODO
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.login-form__submit-btn {
  @include button-raised();

  margin-right: auto;
  margin-bottom: 2 * $point;
  width: 20 * $point;
}

</style>
