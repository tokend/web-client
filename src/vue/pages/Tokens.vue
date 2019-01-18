<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link
          v-ripple
          :to="vueRoutes.tokensExplore"
        >
          <span>{{ 'tokens-page.explore-title' | globalize }}</span>
        </router-link>
        <router-link
          v-ripple
          :to="vueRoutes.balances"
        >
          <span>{{ 'tokens-page.balances-title' | globalize }}</span>
        </router-link>
      </template>
      <template
        v-if="account.accountTypeI === ACCOUNT_TYPES.syndicate"
        slot="extra"
      >
        <button
          v-ripple
          class="create-token-btn"
          @click="isTokensDrawerShown = true"
        >
          {{ 'tokens-page.create-token-btn' | globalize }}
        </button>
      </template>
    </top-bar>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'

import { ACCOUNT_TYPES } from '@tokend/js-sdk'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'tokens',
  components: {
    TopBar,
  },
  data: _ => ({
    ACCOUNT_TYPES,
    vueRoutes,
    isTokensDrawerShown: false,
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

.create-token-btn {
  @include button-raised;
}
</style>
