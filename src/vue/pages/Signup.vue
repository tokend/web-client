<template>
  <div class="auth-page">
    <h2 class="auth-page__title">
      {{
        recoverySeed
          ? 'auth.save-recovery-seed'
          : 'auth.get-started'
            | globalize
      }}
    </h2>

    <div class="auth-page__content">
      <signup-form
        v-if="!recoverySeed"
        :submit-event="'submit'"
        @submit="generateSeed"
      />

      <div class="signup__seed-wrp" v-else>
        <p class="signup__seed-explanations">
          {{ 'auth.save-recovery-seed-details' | globalize }}
        </p>

        <key-viewer :value="recoverySeed" />

        <div class="signup__actions">
          <button
            @click="submit"
            class="app__button-raised auth-page__submit-btn"
          >
            {{ 'auth.lbl-continue' | globalize }}
          </button>
        </div>
      </div>
    </div>

    <div class="auth-page__tips">
      <div class="auth-page__tip">
        {{ 'auth.have-an-account-question' | globalize }}
        <router-link class="auth-page__tip-link" to="/sign-in">
          {{ 'auth.have-an-account-answer' | globalize }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import SignupForm from '../forms/SignupForm'
import KeyViewer from '../common/KeyViewer'

import { base } from '@tokend/js-sdk'

export default {
  name: 'signup',
  components: {
    SignupForm,
    KeyViewer
  },
  data: _ => ({
    recoverySeed: 'SBMN5JKUS6K2VNVFRJVIHDVW2OH5X7KMC2PB2SN23MWSCHKASCN55FIL'
  }),
  methods: {
    generateSeed () {
      this.recoverySeed = base
        .Keypair
        .random()
        .secret()
    },
    submit () {
      // TODO
    }
  }
}
</script>

<style lang="scss" scoped>
@import './auth-page';
.signup__seed-wrp {
  max-width: 51* $point;
}

.signup__seed-explanations {
  margin-bottom: 2 * $point;
}

.signup__actions {
  margin-top: 2 * $point;
  text-align: center;
}

</style>
