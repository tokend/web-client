<template>
  <div class="security">
    <div class="security__row">
      <p class="security__row-title">
        Enable 2FA
      </p>
      <switch-field :is-enabled.sync="isTfaEnabled" />
    </div>
    <hr class="security__line">
    <div class="security__row">
      <p class="security__row-title">
        Password
      </p>
      <a class="security__row-action">
        Change password
      </a>
    </div>
    <hr class="security__line">
    <div class="security__row">
      <p class="security__row-title">
        Account ID
      </p>
      <a class="security__row-action">
        View Account ID
      </a>
    </div>
    <hr class="security__line">
    <div class="security__row">
      <p class="security__row-title">
        Secret seed
      </p>
      <a class="security__row-action">
        View secret seed
      </a>
    </div>
  </div>
</template>

<script>
import SwitchField from '@/vue/fields/SwitchField'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'security',
  components: {
    SwitchField,
  },
  data: _ => ({
    isTfaEnabled: false,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.security {
  background: $col-block-bg;
  @include box-shadow();

  .security__row {
    padding: 2.4rem;
    display: flex;
    justify-content: space-between;

    .security__row-title {
      font-size: 1.8rem;
      color: $col-primary;
    }

    .security__row-action {
      font-size: 1.3rem;
      cursor: pointer;
      color: $col-primary-lighten;
    }
  }

  .security__line {
    margin: 0 2.4rem;
    border: $col-block-line solid .05rem;
  }
}
</style>
