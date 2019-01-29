<template>
  <div class="security">
    <div class="security__row">
      <p class="security__row-title">
        Enable 2FA
      </p>
      <a class="security__row-action">
        Change password
      </a>
      <hr>
    </div>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'security',
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
  background: #fff;
  padding: 2.4rem;
  @include box-shadow();
}
</style>
